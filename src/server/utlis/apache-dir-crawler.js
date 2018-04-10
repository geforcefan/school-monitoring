import request from 'request-promise';
import cheerio from 'cheerio';
import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';
import moment from 'moment';
import { URL } from 'url';
import downloadFile from 'download-file';
import last from 'lodash/last';

const processNode = (node, targetDir) => new Promise((resolve, reject) => {
    if(node.isDirectory) {
        const dirName = path.basename(node.link.pathname);
        const dir = path.join(targetDir, dirName);

        mkdirp.sync(dir); // Make folder recursive

        parseDirectoryIndex(node.link, dir).then(res => resolve())
    } else {
        const filename = decodeURI(last(node.link.href.split("/")));

        downloadFile(node.link.href, {
            directory: targetDir,
            filename
        }, err => err ? reject() : resolve());
    }
});

const parseDirectoryIndex = (url, targetDir) => {
    return request(url.href).then(data => {
        const $ = cheerio.load(data);

        return $('ul a')
            .map((i, a) => $(a).prop("href"))
            .get()
            .slice(1)
            .map(link => new URL(url + link))
            .map(link => ({
                link,
                isDirectory: link.href.substr(-1) === "/"
            }))
    })
        .then(nodes => Promise.all(nodes.map(node => processNode(node, targetDir))))
        .then(nodes => targetDir)
};

export default function(url, targetDir) {
    const tmpDirectory = path.join(os.tmpdir(), targetDir, moment().unix().toString());

    return parseDirectoryIndex(url, tmpDirectory);
}