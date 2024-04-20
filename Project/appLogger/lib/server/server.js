import * as net from 'net';
import config from '../logger/config.js';

const server = net.createServer((socket) => {
    console.log('Connection established');

    socket.on('data', (data) => {
        console.log('Data received: ', data.toString('utf8'));
        socket.end('End');
    });
    socket.on('error', (err) => {
        console.log('Socket ERROR', err.message);
    });
    socket.write('DATAAA');
});
server.on('listening', function () {});

server.listen(config.socketPort, () => {
    console.log(`Server net started on port ${config.socketPort}`);
});
