import net from 'net';
import config from '../config.js';

let client;
const log = (formatter) => (date, level, category, message) => {
    const data = formatter(date, level, category, message);
    client.write(data);
};

function init(formatter) {
    client = net.connect(config.socketPort, () => {
        console.log('Connected to server from network on port ');
    });

    process.on('exit', () => {
        client.exit();
    });

    return { log: log(formatter) };
}

export default { log: init };
