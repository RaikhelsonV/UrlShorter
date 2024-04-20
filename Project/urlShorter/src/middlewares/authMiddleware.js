import UserRepository from '../repository/UserRepository.js';
import express from 'express';
import appLogger from "appLogger";

const log = appLogger.getLogger('authMiddleware.js');

export const jsonParser = express.json();
export const urlEncodedParser = express.urlencoded({extended: true});

export default async (req, res, next) => {
    const auth = req.header('Authorization');
    log.debug('Authorization: ' + auth);
    if (auth?.startsWith('Basic')) {
        log.debug('Basic')
        const encodedCredentials = auth.split(' ')[1];

        const decodedCredentials = Buffer.from(
            encodedCredentials,
            'base64'
        ).toString('utf-8');

        const [username, password] = decodedCredentials.split(':');

        log.debug('Username:', username);
        log.debug('Password:', password);

        const user = await new UserRepository().getUserByName(username);

        if (user && user.password === password) {
            req.user = {...user, id: user.id};
            log.debug('REQ USER Authorization' + JSON.stringify(req.user));

            req.session.user = {...user, id: user.id};
            next();
            return;
        }
        log.warn('Invalid username or password');
        return res.status(401).end('Invalid username or password');
    }

    if (req.session.user) {
        log.debug('Authorization Session ' + JSON.stringify(req.session.user));
        req.user = req.session.user;
        next();
    } else {
        log.warn('Auth header not provided');
        res.setHeader("WWW-Authenticate", "Basic ")
        return res.status(401).end('Auth header not provided');
    }


};
