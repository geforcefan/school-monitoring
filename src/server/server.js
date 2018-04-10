import express from 'express';
import initScheduler from './scheduler/init-scheduler'

import config from './utlis/config';

import scheduleRouter from './router/schedule';
import filesRouter from './router/files';

class Server {
    application = null;

    constructor() {
        initScheduler();

        this.initServer();
        this.initRoutes();
        this.initStaticFiles();
    }

    initStaticFiles() {
        this.application.use("/public", express.static('files'));
    }

    initRoutes () {
        const apiRouter = express.Router();
        apiRouter.use("/schedule", scheduleRouter);
        apiRouter.use("/files", filesRouter);

        this.application.use("/api", apiRouter);
    }

    initServer() {
        this.application = express();
        this.application.listen(config.server.port, config.server.host, () => console.log(`Started server ${config.server.host}:${config.server.port}`))
    }
}

new Server();