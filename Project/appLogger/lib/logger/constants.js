const level = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

const scoreLevel = {
    [level.ERROR]: 1,
    [level.WARN]: 2,
    [level.INFO]: 3,
    [level.DEBUG]: 4,
    [level.TRACE]: 5,
};

const appender = {
    CONSOLE: 'CONSOLE',
    FILE: 'FILE',
    NETWORK: 'NETWORK',
};

const files = {
    LOG_FILE: 'logs/app.log',
    LOG_ERROR_FILE: 'logs/app_error.log',
};

const format = {
    JSON: 'JSON',
    CSV: 'CSV',
    DEFAULT: 'DEFAULT',
};

const network = {
    host: '127.0.0.1',
    socketPort: 8009,
    httpPort: 8082,
};

const delimetter = ', ';
const logFileName = process.argv[1];

export {
    level,
    scoreLevel,
    appender,
    files,
    format,
    delimetter,
    logFileName,
    network,
};
