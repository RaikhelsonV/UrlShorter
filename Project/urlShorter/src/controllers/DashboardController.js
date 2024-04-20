import {Router} from 'express';
import {urlEncodedParser} from '../middlewares/authMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import appLogger from "appLogger";
import RateLimit from "../middlewares/RateLimit.js";
import DashboardService from "../services/DashboardService.js";


const log = appLogger.getLogger('UrlController.js');

export default class DashboardController extends Router {
    constructor(redisClient) {
        super();
        this.redisClient = redisClient;
        this.rateLimit = new RateLimit(this.redisClient);
        this.dashboardService = new DashboardService(this.rateLimit);
        this.use(authMiddleware);
        this.init();
    }

    init = () => {

        this.get('/', async (req, res) => {
            const user_id = req.session.user.user_id;
            const {top5Urls, top5UrlsByUser, allUrlsByUser, limitsList} = await this.dashboardService.sendDataToDashBoard(user_id);
            res.render('dashboard.ejs', {top5Urls, top5UrlsByUser, allUrlsByUser, limitsList});
        });

    }
}
