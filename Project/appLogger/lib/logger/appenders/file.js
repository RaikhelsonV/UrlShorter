import { EventEmitter } from 'events';
import fs from 'fs';
import * as constants from '../constants.js';
import { formatMessage } from './utils.js';
import path from 'path';
import { Transform } from 'stream';

class LogTransformer extends Transform {
    constructor(options) {
        super(options);
    }

    async _transform(chunk, encoding, callback) {
        try {
            if (
                constants.format.JSON === true ||
                constants.format.CSV === true
            ) {
                const logData = constants.format.JSON
                    ? JSON.parse(chunk)
                    : chunk.toString('utf8');

                const formattedData = await formatMessage([
                    logData.date,
                    logData.level,
                    logData.category,
                    logData.message,
                    logData.formatter,
                    logData.fileName,
                ]);

                this.push(formattedData.toString());
                callback();
            } else {
                const logData = chunk.toString('utf8');
                this.push(logData.toString());
                callback();
            }
        } catch (error) {
            callback(error);
        }
    }
}

const ee = new EventEmitter();
let logFile = path.join(constants.files.LOG_FILE);

const writeStream = fs.createWriteStream(logFile, { flags: 'a' });
const logTransform = new LogTransformer();
logTransform.pipe(writeStream);

async function fileAppender(date, level, category, message, formatter) {
    const logMessage = await formatMessage(
        date,
        level,
        category,
        message,
        formatter,
        constants.logFileName
    );

    ee.emit('log', logMessage, level);
}

ee.on('log', async (logMessage, level) => {
    await appendToFile(logMessage, level);
});

async function appendToFile(data, level) {
    if (constants.level.ERROR === level) {
        logFile = constants.files.LOG_ERROR_FILE;
        const errorWriteStream = fs.createWriteStream(logFile, { flags: 'a' });
        logTransform.pipe(errorWriteStream);
        errorWriteStream.write(data);
    }
    writeStream.write(data);
}

process.on('exit', () => {
    logTransform.end();

    writeStream.on('finish', () => {
        console.log('File closed.');
    });

    writeStream.on('error', (error) => {
        console.error('Error writing to log file:', error);
    });
});

export default { log: fileAppender };
