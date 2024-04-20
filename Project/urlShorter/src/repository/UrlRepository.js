import UrlModelObj from "../knex/objection/UrlModelObj.js";
import ValidationError from "../error/ValidationError.js";
import DataBaseError from "../error/DataBaseError.js";
import appLogger from "appLogger";

const log = appLogger.getLogger('UrlRepository.js');


export default class UrlRepository {
    async add(url) {
        try {
            url.created_at = new Date(url.created_at).toISOString();
            const insertedURL = await UrlModelObj.query().insert({
                code: url.code,
                name: url.name,
                url: url.url,
                created_at: url.created_at,
                visits: url.visits,
                expire_at: url.expire_at,
                type: url.type,
                enabled: url.enabled,
                user_id: url.user.user_id,
            });

            log.debug("Inserted url:", JSON.stringify(insertedURL));
        } catch (error) {
            log.error('Error saving url:', error);
            throw new ValidationError('Failed to save url');
        }
    }

    async addVisit(code) {
        try {
            await UrlModelObj.query()
                .where('code', code)
                .increment('visits', 1);
        } catch (error) {
            log.error('Error adding visit:', error);
            throw new ValidationError('Failed to add visit');
        }
    }

    async updateEnabledStatus(code, status) {
        try {
            await UrlModelObj.query()
                .where('code', code)
                .patch({
                    enabled: status
                });
            log.debug(`Enabled status for URL with code ${code} updated to ${status}`);
        } catch (error) {
            log.error(`Error updating enabled status for URL with code ${code}:`, error);
            throw new ValidationError('Failed to update enabled status');
        }
    }
    async updateType(code, type) {
        try {
            await UrlModelObj.query()
                .where('code', code)
                .patch({
                    type: type
                });
            log.debug(`Type for URL with code ${code} updated to ${type}`);
        } catch (error) {
            log.error(`Error updating type for URL with code ${code}:`, error);
            throw new ValidationError('Failed to update type');
        }
    }

    async updateTypeAndExpireAt(code, type, expire_at){
        try {
            await UrlModelObj.query()
                .where('code', code)
                .patch({
                    type: type,
                    expire_at: expire_at,
                });
            log.debug(`Type for URL with code ${code} updated to ${type}`);
        } catch (error) {
            log.error(`Error updating type for URL with code ${code}:`, error);
            throw new ValidationError('Failed to update type');
        }
    }

    async updateExpireAt(code, expire_at){
        try {
            await UrlModelObj.query()
                .where('code', code)
                .patch({
                    expire_at: expire_at,
                });
            log.debug(`Expire_at for URL with code ${code} updated to ${expire_at}`);
        } catch (error) {
            log.error(`Error updating expire_at for URL with code ${code}:`, error);
            throw new ValidationError('Failed to update expire_at');
        }
    }

    async delete(code) {
        try {
            const deletedUrl = await UrlModelObj.query()
                .delete()
                .where('code', code);
            log.debug("Deleted url:", deletedUrl);
            return true;
        } catch (error) {
            log.error(`Error deleting url with code ${code}:`, error);
            throw new ValidationError('Failed to delete url');
        }
    }

    async get(code) {
        try {
            const url = await UrlModelObj.query().findOne('code', code);
            log.debug('DB BY code' + JSON.stringify(url));
            return url;
        } catch (error) {
            log.error(`Error getting url by code: ${code}`, error);
            throw new ValidationError('Failed to get url by code');
        }
    }

    async getUrlByUser(user) {
        try {
            const urls = await UrlModelObj.query().where('user_id', user.user_id);
            return urls;
        } catch (error) {
            log.error('Error getting URLs by user:', error);
            throw new ValidationError('Failed to get URLs by user');
        }
    }
    async getUrlByUserId(user_id) {
        try {
            const urls = await UrlModelObj.query().where('user_id', user_id);
            return urls;
        } catch (error) {
            log.error('Error getting URLs by user:', error);
            throw new ValidationError('Failed to get URLs by user');
        }
    }

    async getTopFiveVisitedUrlsByUserId(user_id) {
        try {
            const result = await UrlModelObj.query()
                .where('user_id', user_id)
                .orderBy('visits', 'desc')
                .limit(5);
            log.debug(`Top 5 visited URLs for user ${user_id}: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            log.error(`Error getting top 5 visited URLs for user ${user_id}:`, error);
            throw new ValidationError('Failed to get top 5 visited URLs');
        }
    }

    async getTopFiveVisitedUrls() {
        try {
            const result = await UrlModelObj.query()
                .orderBy('visits', 'desc')
                .limit(5);
            log.debug(`Top 5 visited URL: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            log.error(`Error getting top 5 visited URLs`, error);
            throw new DatabaseError('Failed to get top 5 visited URLs');
        }
    }

    async getAll() {
        try {
            const result = await UrlModelObj.query();
            return result;
        } catch (error) {
            log.error('Error getting all url:', error);
            throw new DatabaseError('Failed to get all url');
        }
    }
}
