import doEverything from '../tasks/do-everything';
import Scheduler from './scheduler';
import config from '../utlis/config';

export default function() {
    Scheduler.insertTask("doEverything", doEverything, config.scheduler.doEverythingInterval * 1000);
};