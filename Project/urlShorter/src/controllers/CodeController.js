import {Router} from 'express';
import UrlService from '../services/UrlService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import appLogger from "appLogger";
import {publicIpv4} from 'public-ip';


const log = appLogger.getLogger('CodeController.js');

export default class CodeController extends Router {
    constructor(redisClient, rateLimit) {
        super();
        this.urlService = new UrlService();
        this.redisClient = redisClient;
        this.rateLimit = rateLimit;
        this.init();

    }

    init = () => {
        this.use(authMiddleware);
        this.use(this.rateLimitMiddleware)
        this.get('/:code', async (req, res) => {
            const code = req.params.code;
            const urlData = await this.urlService.getUrlInfo(code);

            console.log("Code Url Data:", JSON.stringify(urlData));

            if (!urlData) {
                res.status(404).send('Not Found');
                return;
            }

            if (!urlData.enabled) {
                res.status(404).send('Link is not active');
                return;
            }

            if (urlData.enabled === true) {

                await this.urlService.addVisit(urlData.user_id, code);
                res.redirect(302, urlData.url);

                if (urlData.type === "one_time") {
                    await this.urlService.updateEnabledStatus(code, false);
                }
            }
        });
    };


    rateLimitMiddleware = async (req, res, next) => {
        console.log("Call rateLimitMiddleware" + JSON.stringify(req.user));
        const userId = req.user.user_id;
        const urlCode = req.url;

        try {
            const IP = await publicIpv4();
            console.log("Public IPv4:", IP);

            const userKeys = {userRequestsKey: `rateLimitUserId:${userId}`};
            const urlKeys = {urlRequestsKey: `rateLimitCodeUrl:${urlCode}`};
            const ipKeys = {ipRequestsKey: `rateLimitIP:${IP}`}

            const isUserRateLimited = await this.rateLimit.checkRateLimit(userKeys, "user");
            const isUrlRateLimited = await this.rateLimit.checkRateLimit(urlKeys, "url");
            const isIPRateLimited = await this.rateLimit.checkRateLimit(ipKeys, "ip");

            if (!isUserRateLimited || !isUrlRateLimited || !isIPRateLimited) {
                res.status(429).send('Rate Limit Exceeded');
                return;
            }


            await this.rateLimit.getLimitsListByUser(userId)
            next();

        } catch
            (error) {
            console.error("An error occurred:", error);
            res.status(500).send('Internal Server Error');
        }
    };

}
