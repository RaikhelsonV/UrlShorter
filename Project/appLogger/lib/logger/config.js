import * as constants from './constants.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultConfig = {
    logLevel: constants.level.TRACE,
    appender: constants.appender.CONSOLE,
    formatter: constants.format.DEFAULT,
    host: constants.network.host,
    socketPort: constants.network.socketPort,
    httpPort: constants.network.httpPort,
};

function initConfig() {
    const logLevel = (
        process.env.LOG_LEVEL || defaultConfig.logLevel
    ).toUpperCase();
    const appender = (
        process.env.LOG_APPENDER || defaultConfig.appender
    ).toUpperCase();
    const formatter = (
        process.env.LOG_FORMATTER || defaultConfig.formatter
    ).toUpperCase();
    const host = process.env.HOST || defaultConfig.host;
    const socketPort = process.env.SOCKET_PORT || defaultConfig.socketPort;
    const httpPort = process.env.HTTP_PORT || defaultConfig.httpPort;

    return {
        logLevel: logLevel,
        appender: appender,
        scoreLevel: constants.scoreLevel[logLevel],
        formatter: formatter,
        host: host,
        socketPort: socketPort,
        httpPort: httpPort,
    };
}
const config = initConfig();

export default config;
