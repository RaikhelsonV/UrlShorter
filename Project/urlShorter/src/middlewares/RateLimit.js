import {sendRateLimitByCode} from "../webSocket.js";
import UrlService from "../services/UrlService.js";
import DatabaseError from "../error/DataBaseError.js";
import config from '../config.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('RateLimit.js');

export default class RateLimit {

    constructor(redisClient) {
        this.redisClient = redisClient;
        this.urlService = new UrlService();
    }

    async checkRateLimit(keys, resourceType) {
        try {
            const {duration, limit} = config.rateLimits[resourceType];

            for (const key of Object.values(keys)) {
                await this.redisClient.incr(key);
                await this.redisClient.expire(key, duration);
                const count = parseInt(await this.redisClient.get(key));
                if (count >= limit) return false;
            }
            return true;
        } catch (error) {
            log.error('Error checking rate limit:', error);
            return false;
        }
    }

    async deleteRateLimitByUserId(userId) {
        const userKey = `rateLimitUserId:${userId}`;
        try {
            await this.redisClient.del(userKey);
        } catch (error) {
            log.error('Error deleting rate limits by user:', error);
            throw new DatabaseError('Failed to delete rate limit by user_id');
        }
    }

    async deleteRateLimitByUrlCode(user_id, code) {
        const urlKey = `rateLimitCodeUrl:/${code}`;
        try {
            await this.redisClient.del(urlKey);
            await this.getLimitsListByUser(user_id);
        } catch (error) {
            log.error('Error deleting rate limits by code:', error);
            throw new DatabaseError('Failed to delete rate limit by code');
        }
    }

    async deleteRateLimitByIP(ip) {
        const ipKey = `rateLimitIP:${ip.ip_address}`;
        try {
            await this.redisClient.del(ipKey);
        } catch (error) {
            log.error('Error deleting rate limits by IP:', error);
            throw new DatabaseError('Failed to delete rate limit by IP');
        }
    }

    async getLimitsListByUser(user_id) {
        const allUrlsByUser = await this.urlService.getUrlsByUserId(user_id)
        const limitsList = [];

        for (const url of allUrlsByUser) {
            let limitByCode = await this.getValueByKey(url.code)
            const {duration, limit} = config.rateLimits["url"];

            let percentage = (limitByCode / limit) * 100;
            if (isNaN(percentage) || !isFinite(percentage)) {
                percentage = 0;
            } else {
                percentage = Math.min(100, Math.max(0, percentage));
            }
            const limitInfo = {code: url.code, limit: limitByCode, percentage: percentage.toFixed(0)};

            limitsList.push(limitInfo);
        }
        sendRateLimitByCode(limitsList)
        return limitsList;
    }

    async getValueByKey(code) {
        const urlKey = `rateLimitCodeUrl:/${code}`;
        try {
            const limit = await this.redisClient.get(urlKey);
            return limit;
        } catch (error) {
            log.error('Error getting value by key:', error);
            throw new DatabaseError('Failed to get value by key.');
        }
    }

}
