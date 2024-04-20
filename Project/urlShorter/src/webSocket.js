import {WebSocket, WebSocketServer} from 'ws';
import appLogger from "appLogger";

const log = appLogger.getLogger('WebSocket.js');
let wss;

function init(server) {
    log.info('Starting WebSocket server...');
    wss = new WebSocketServer({server});

    wss.on('connection', function connection(ws) {
        log.info('New client connected');

        ws.on('message', function message(data) {
            log.info('received from client: %s', data);
        });

        log.info('WebSocket server initialized');
    });
}


function sendAllUserLinksCountUpdate(count) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'countUpdate', data: count}));
            }
        });
    }
}
function sendTopFiveByUser(topUrls) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'topUpdate', data: topUrls}));
            }
        });
    }
}
function sendTopFive(topUrls) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'topSystemUpdate', data: topUrls}));
            }
        });
    }
}

function sendRateLimitByCode(limitList) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'rateLimits', data: limitList}));
            }
        });
    }
}
function sendVisitsUpdate(visitsData) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                log.info("web socket open")
                client.send(JSON.stringify({type: 'visitsUpdate', data: visitsData}));
            }
        });
    }
}

export {init, sendVisitsUpdate, sendAllUserLinksCountUpdate, sendTopFiveByUser, sendTopFive, sendRateLimitByCode};
