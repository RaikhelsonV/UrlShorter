import IpRepository from "../repository/IpRepository.js";
import IpModel from "../models/IpModel.js";
import DatabaseError from "../error/DataBaseError.js";
import appLogger from "appLogger";

const log = appLogger.getLogger('UserService.js');

export default class IpService {
    constructor() {
        this.ipRepository = new IpRepository();
    }

    async saveUserIPAddress(user_id, ip_address) {
        try {
            const ip = new IpModel(user_id, ip_address);
            await this.ipRepository.add(ip);
            return ip;
        } catch (error) {
            log.error('Error adding IP address:', error);
            throw new DatabaseError('Error save IP address');
        }
    }

    async removeIpAddress(user_id, ip_address) {
        try {
            await this.ipRepository.deleteIpAddress(user_id, ip_address);
        } catch (error) {
            log.error('Error removing IP address:', error);
            throw new DatabaseError('Failed to remove IP address');
        }
    }

    async getUserIpAddresses(user_id) {
        try {
            const ipAddresses = await this.ipRepository.getIpAddressesByUserId(user_id);
            const result = [];
            for (const ip of ipAddresses) {
                result.push({
                    ip_address: ip.ip_address,
                });
            }
            return result;
        } catch (error) {
            log.error('Error getting user IP addresses:', error);
            throw new DatabaseError('Failed to get user IP addresses');
        }
    }
}