import UrlService from "./UrlService.js";
import appLogger from "appLogger";

const log = appLogger.getLogger('UrlService.js');

export default class DashboardService {
    constructor(rateLimit) {
        this.urlService = new UrlService();
        this.rateLimit = rateLimit;
    }

    sendDataToDashBoard = async (user_id) => {
        const top5Urls = await this.urlService.getTopFiveUrls();
        const top5UrlsByUser = await this.urlService.getTopFiveUrlsByUser(user_id);

        const allUrlsByUser = await this.urlService.getUrlsByUserId(user_id);
        const limitsList = await this.rateLimit.getLimitsListByUser(user_id);

        return {top5Urls, top5UrlsByUser, allUrlsByUser, limitsList};
    }


}
