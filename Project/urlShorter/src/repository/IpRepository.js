import IpModelObj from '../knex/objection/IpModelObj.js'
import DatabaseError from "../error/DataBaseError.js";
import {encryptIpAddress, decryptIpAddress} from '../utils/ipEncryption.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('UrlRepository.js');

export default class IpRepository {

    async add(ip) {
        try {
            ip.ip_address = encryptIpAddress(ip.ip_address);
            ip.created_at = new Date(ip.created_at).toISOString();
            await IpModelObj.query().insert(ip);
        } catch (error) {
            log.error('Error creating IP address:', error);
            throw new DatabaseError('Error creating IP address');
        }
    }

    async getIpAddressesByUserId(user_id) {
        try {
            const ip_addresses = await IpModelObj.query().where('user_id', user_id);
            const decryptedIpAddresses = ip_addresses.map(ip => ({
                    ...ip,
                    ip_address: decryptIpAddress(ip.ip_address)
                }
            ));
            return decryptedIpAddresses;
        } catch (error) {
            log.error('Error getting IP addresses:', error);
            throw new DatabaseError('Failed to get IPs by user_id');
        }
    }

    async deleteIpAddressesByUserId(user_id) {
        try {
            const deleteQuery = await IpModelObj.query().delete().where('user_id', user_id);
        } catch (error) {
            log.error('Error deleting IP addresses:', error);
            throw new DatabaseError('Failed to delete IPs by user_id');
        }
    }
}