import apacheDirCrawler from '../utlis/apache-dir-crawler';
import dirMerger from '../utlis/dir-merger';
import substitutionScheduleGenerator from '../utlis/substitution-schedule-generator';

import db from '../utlis/db';

import path from 'path';

import config from '../utlis/config';
import { URL } from 'url';

const apacheDirCrawlerConf = config.apacheDirCrawler;
const dirMergerConf = config.directoryMerger;

const runApacheDirCrawler = () => {
    const url = new URL(apacheDirCrawlerConf.url);

    url.username = apacheDirCrawlerConf.auth.username;
    url.password = apacheDirCrawlerConf.auth.password;

    return apacheDirCrawler(
        url,
        apacheDirCrawlerConf.targetDir,
    )
};

const processSubstitutionSchedule = schedules => {
    db.set('substitutionSchedule', schedules).write();
};

export default function() {
    return runApacheDirCrawler()
        .then(targetDir => dirMerger(targetDir, dirMergerConf.destinationDir))
        .then(targetDir => substitutionScheduleGenerator(path.join(targetDir, config.substitutionSchedule.directory)))
        .then(schedules => processSubstitutionSchedule(schedules))
        .catch(err => console.log(err));
}