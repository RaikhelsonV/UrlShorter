import {Router} from 'express';
import UrlService from '../services/UrlService.js';
import UserService from "../services/UserService.js";
import UserRepository from '../repository/UserRepository.js';
import {jsonParser, urlEncodedParser} from '../middlewares/authMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import appLogger from "appLogger";
import RateLimit from "../middlewares/RateLimit.js";


const log = appLogger.getLogger('UrlController.js');

export default class UrlController extends Router {
    constructor(redisClient) {
        super();
        this.urlService = new UrlService();
        this.userService = new UserService()
        this.userRepository = new UserRepository();
        this.redisClient = redisClient;
        this.rateLimit = new RateLimit(this.redisClient);
        this.use(authMiddleware);
        this.init();
    }

    init = () => {

        this.get('/info/:code', async (req, res) => {
            const code = req.params.code;
            const urlData = await this.urlService.getUrlInfo(code);
            res.json(urlData);
        });

        this.get('/', async (req, res) => {
            const user = await this.userRepository.getUserByName(req.user.name);
            const userUrls = await this.urlService.getUrlsByUser(user);
            await this.urlService.updateExpiredUrls(userUrls)
            res.render('url', {userUrls, deleteSuccess: false, addSuccess: false, error: null});
        });

        this.post('/add', jsonParser, async (req, res) => {
            const code = await this.urlService.addUrl(req.body, req.user);
            res.json({code});
        });

        this.post('/addUrl', urlEncodedParser, async (req, res) => {
            let addSuccess = false;
            try {
                const user = await this.userRepository.getUserByName(req.user.name);

                const {name, url, code, type, expire_at} = req.body;

                let expireDate = null;
                if (type === 'temporary') {
                    expireDate = expire_at.toString();
                }

                req.user = user;

                await this.urlService.addUrl({name, url, code, type, expire_at: expireDate}, req.user);

                addSuccess = true;
                res.redirect(`/url?addSuccess=${addSuccess}`);

                return;
            } catch (error) {
                res.render('url', {
                    userUrls: [],
                    deleteSuccess: false,
                    addSuccess: false,
                    error: 'URL with this code already exists.'
                });
            }

        });

        this.post('/updateEnabledStatus', urlEncodedParser, async (req, res) => {
            const code = req.body.code;
            const status = req.body.enabled === 'true';
            try {
                await this.urlService.updateEnabledStatus(code, status);
                res.redirect('/url');
            } catch (error) {
                log.error(`Error updating enabled status for URL with code ${code}:`, error);
                res.render('url', {
                    userUrls: [],
                    deleteSuccess: false,
                    addSuccess: false,
                    error: error.message,
                });

            }
        });
        this.post('/updateType', urlEncodedParser, async (req, res) => {
            const code = req.body.code;
            const type = req.body.type;

            try {
                if (type === 'one_time' || type === 'permanent') {
                    await this.urlService.updateTypeAndExpireAt(code, type, null);
                } else {
                    await this.urlService.updateType(code, type);
                }

                res.redirect('/url');
            } catch (error) {
                log.error(`Error updating type for URL with code ${code}:`, error);
                res.sendStatus(500);

            }
        });

        this.post('/updateDate', urlEncodedParser, async (req, res) => {
            const code = req.body.code;
            const expire_at = req.body.expire_at;
            console.log("Expire" + JSON.stringify(req.body))
            try {
                await this.urlService.updateDate(code, expire_at);

                res.redirect('/url');
            } catch (error) {
                log.error(`Error updating expire_at for URL with code ${code}:`, error);
                res.sendStatus(500);
            }
        });


        this.post('/delete', urlEncodedParser, async (req, res) => {
            console.log("DEEEELETE " + JSON.stringify(req.body))
            const code = req.body.code;
            const userId = req.body.user_id;

            try {
                const result = await this.urlService.deleteUrl(code);

                await this.rateLimit.deleteRateLimitByUrlCode(userId, code);

                const deleteSuccess = result;

                res.redirect(`/url?deleteSuccess=${deleteSuccess}`);
            } catch (error) {
                log.error('Error deleting url:', error);
                res.render('url', {userUrls: [], deleteSuccess: false, addSuccess: false, error: error.message});

            }
        });
    };
}
