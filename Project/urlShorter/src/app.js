import webContext from './webContext.js';
import {init} from './webSocket.js';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import appLogger from "appLogger";

dotenv.config();

const log = appLogger.getLogger('app.js');
const PORT = process.env.PORT;
const app = express();


webContext(app);
const server = http.createServer(app);
init(server)

server.listen(PORT, () => {
    log.info('Server started')
});
