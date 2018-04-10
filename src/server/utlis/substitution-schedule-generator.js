import fs from 'fs';
import path from 'path';
import first from 'lodash/first';
import last from 'lodash/last';
import cheerio from 'cheerio';
import moment from 'moment';

const strToDate = str => {
    const datePieces = str.split(".");
    return moment(`${datePieces[2]}-${datePieces[1]}-${datePieces[0]}`);
};

const parseSubstitutionSchedule = html => {
    const $ = cheerio.load(html);

    const schedule = $('table.k').map((i, table) => $(table)).get().map(table => {
        let currentGrade = null;

        return table.find("tr").slice(1).map((k, tr) => $(tr)).get().map(tr => {
            const td = $(tr).find("td");

            const grade = $(tr).find("th").eq(0).text().trim();
            const name = td.eq(0).text().trim();
            const period = td.eq(1).text().trim();
            const substitute = td.eq(2).text().trim();
            const subject = td.eq(3).text().trim();
            const room = td.eq(4).text().trim();
            const comment = td.eq(5).text().trim();

            if(grade)
                currentGrade = grade;

            return { grade: currentGrade, name, period, substitute, subject, room, comment };
        });
    });

    const schedules = $('h2')
        .map((i, h2) => $(h2).text())
        .get()
        .map(h2 => strToDate(last(h2.split(",")).trim()).unix())
        .map((timestamp, i) => ({
            timestamp,
            schedule: schedule[i]
        }));

    return schedules;
};

export default function (directory) {
    return new Promise((resolve, reject) => fs.readdir(directory, (err, res) => err ? reject(err) : resolve(res)))
        .then(files => Promise.all(files.map(file => new Promise((resolve, reject) => fs.stat(path.join(directory, file), (err, res) => err ? reject(err) : resolve({ ...res, file }))))))
        .then(files => files
            .sort((a, b) => b.mtime - a.mtime)
            .filter(file => file.file.includes(".html"))
            .map(file => ({
                filePath: path.join(directory, file.file),
                fileName: file.file,
                modificationDate: file.mtime,
                content: fs.readFileSync(path.join(directory, file.file)).toString()
            }))
        )
        .then(files => first(files))
        .then(file => parseSubstitutionSchedule(file.content))
};