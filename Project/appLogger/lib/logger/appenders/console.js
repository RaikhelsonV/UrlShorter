import { EventEmitter } from 'events';
import { formatMessage } from './utils.js';
import { Writable } from 'stream';
import * as constants from '../constants.js';

const ee = new EventEmitter();

const ConsoleStream = new Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    },
});

function consoleAppender(date, level, category, message, formatter) {
    const logMessage = {
        date,
        level,
        category,
        message,
        formatter,
        filename: constants.logFileName,
    };
    ee.emit('log', logMessage);
}

ee.on('log', async (logMessage) => {
    const formattedMessage = await formatMessage(
        logMessage.date,
        logMessage.level,
        logMessage.category,
        logMessage.message,
        logMessage.formatter,
        logMessage.filename
    );
    ConsoleStream.write(formattedMessage);
});
process.on('exit', () => {
    ConsoleStream.end();
});

export default { log: consoleAppender };
