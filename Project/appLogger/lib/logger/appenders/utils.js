import * as constants from '../constants.js';
import {stringify} from 'csv-stringify';

async function formatMessage(
    date,
    level,
    category,
    message,
    formatter,
    fileName
) {
    if (formatter === constants.format.JSON) {
        return formatJSON({date, level, category, message, fileName});
    } else if (formatter === constants.format.CSV) {
        return formatCSV([{date, level, category, message, fileName}]);
    } else {
        return formatDefault({date, level, category, message, fileName});
    }
}

function formatJSON(logData) {
    const jsonLog = JSON.stringify(logData);
    return `${jsonLog}\n`;
}

async function formatCSV(logData) {
    return await stringifyAsync(logData, {header: false});
}

async function stringifyAsync(logData, options) {
    return new Promise((resolve, reject) => {
        stringify(logData, options, (err, output) => {
            if (err) {
                reject(err);
            } else {
                resolve(output);
            }
        });
    });
}

function formatDefault(logData) {
    return `Date: ${logData.date}, category: ${logData.category}, level: ${logData.level}, message: ${logData.message}, fileName: ${logData.fileName}\n`;
}

export {formatMessage};
