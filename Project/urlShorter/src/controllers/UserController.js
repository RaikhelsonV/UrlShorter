import {Router} from 'express';
import {publicIpv4} from 'public-ip';
import appLogger from "appLogger";
import UserService from '../services/UserService.js';
import UrlService from "../services/UrlService.js";
import IpService from "../services/IpService.js";
import DashboardService from "../services/DashboardService.js";
import {jsonParser, urlEncodedParser} from '../middlewares/authMiddleware.js';
import RateLimit from "../middlewares/RateLimit.js";

const log = appLogger.getLogger('UserController.js');

export default class UserController extends Router {
    constructor(redisClient) {
        super();
        this.userService = new UserService();
        this.urlService = new UrlService();
        this.ipService = new IpService();
        this.redisClient = redisClient;
        this.rateLimit = new RateLimit(this.redisClient);
        this.dashboardService = new DashboardService(this.rateLimit);

        this.init();
    }

    init = () => {
        this.get('/', async (req, res) => {
            res.render('login.ejs');
        });

        this.post('/login', urlEncodedParser, async (req, res) => {
            const {email, password} = req.body;
            console.log(email, password)
            try {
                const user = await this.userService.authenticate(email, password);
                if ('error' in user) {
                    return res.render('login.ejs', {error: user.error});
                }
                if (user) {
                    const IP = await publicIpv4();
                    await this.ipService.saveUserIPAddress(user.user_id, IP);

                    req.session.user = {
                        id: user.id,
                        user_id: user.user_id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        role: user.role
                    };
                    if (user.role === 'admin') {
                        res.redirect('/admin');
                    } else {
                        res.redirect('/url');
                    }
                    await this.dashboardService.sendDataToDashBoard(user.user_id)
                }
            } catch (error) {
                log.error('Error logging in:', error);
                return res.render('login.ejs', {error: 'Error logging in'});
            }
        });


        this.get('/registration', async (req, res) => {
            res.render('registration.ejs');
        });


        this.post('/registration', urlEncodedParser, async (req, res) => {
            try {
                const {name, surname, password, email, role} = req.body;
                const newUser = await this.userService.create(name, surname, password, email, role);
                const IP = await publicIpv4();
                await this.ipService.saveUserIPAddress(newUser.user_id, IP);

                req.session.user = {
                    id: newUser.id,
                    user_id: newUser.user_id,
                    name: name,
                    email: email,
                    password: password,
                    role: newUser.role
                };

                log.debug(JSON.stringify(newUser))
                if (newUser.role === 'admin') {
                    res.redirect('/admin');
                } else {
                    res.redirect('/url');
                }
                await this.dashboardService.sendDataToDashBoard(newUser.user_id)

            } catch (error) {
                log.error('Error creating user:', error);
                if (error.message === 'User with this email already exists') {
                    res.status(400).render('registration.ejs', {error: 'User with this email already exists. Please register with a different email.'});
                } else {
                    res.status(500).render('registration.ejs', {error: 'Error registering user'});
                }

            }

        });

        this.post('/logout', (req, res) => {
            console.log("LOGOUT")
            req.session.destroy((err) => {
                if (err) {
                    log.error('Error logging out:', err);
                    res.status(500).send('Error logging out');
                } else {
                    console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    res.clearCookie('connect.sid');
                    res.redirect('/user');
                }
            });
        });


        this.get('/all', jsonParser, async (req, res) => {
            const users = await this.userService.getUsersPublicData();
            res.json(users);
        });

        this.post('/create', jsonParser, async (req, res) => {
            const {name, surname, password, email} = req.body;
            log.info(name, password);
            const newUser = await this.userService.create(name, surname, password, email);
            res.json(newUser);
        });
    };
}
