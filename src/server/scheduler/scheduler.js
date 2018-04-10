class Scheduler {
    _tasks = {};

    insertTask(name, task, interval) {
        if(typeof task !== "function")
            return console.log(`Task ${name} is not a function, just... do you things right`); // @todo: throw exception

        const tastkFunc = () => {
            console.log(`Running Task ${name}. Next update in ${interval / 1000} sec.`);

            task().then(res => console.log(`Task ${name} has been completed.`));
        };

        this._tasks[name] = setInterval(tastkFunc, interval);

        tastkFunc(); // execute once, then after a given delay
    }

    stopTask(name) {
        clearInterval(this._tasks[name]);
    }
}

export default new Scheduler();