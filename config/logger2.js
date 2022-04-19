'use strict'

const log4js = require('log4js');

log4js.configure({
    appenders: {
        critical:{
            type: "file",
            filename: "logs/critical.log",
            category: 'critical',
            maxLogSize: 20480,
            backups: 10

        }

    },
    categories: {
        default: {
            appenders: ['critical'],
            level: 'error'
        }
    }
});

const logger2 = log4js.getLogger('critical');
module.exports = logger2;

