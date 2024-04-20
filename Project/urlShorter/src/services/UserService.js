import UserRepository from '../repository/UserRepository.js'
import UserModel from '../models/userModel.js';
import {UserRoles} from '../models/userRoles.js';
import {generatedUserId} from '../utils/randomCode.js';
import HashPassword from "../utils/HashPassword.js";
import ValidationError from "../error/ValidationError.js";
import appLogger from "appLogger";

const log = appLogger.getLogger('UserService.js');

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(name, surname, password, email, role) {
        const existingUsers = await this.userRepository.getAll();

        let userRole = UserRoles.USER;
        if (existingUsers.length === 0) {
            userRole = UserRoles.ADMIN;
        }
        if (role === UserRoles.ADMIN) {
            userRole = role;
        }
        const hashedPassword = await HashPassword.hashPassword(password);

        const user = new UserModel(generatedUserId('user'), name, surname, hashedPassword, email, userRole);
        await this.userRepository.save(user);
        return user;
    }

    async delete(user_id) {
        try {
            await this.userRepository.deleteUserAndAssociatedData(user_id);
        } catch (error) {
            log.error(`Error deleting user with ID ${user_id}: ${error}`);
            throw new ValidationError(`Failed to delete user with ID ${user_id}`);
        }
    }

    async authenticate(email, password) {
        try {
            const user = await this.userRepository.getUserByEmail(email);

            if (!user) {
                return {error: 'User not found'};
            } else {
                const passwordMatch = await HashPassword.comparePasswords(password, user.password);
                if (passwordMatch) {
                    return user;
                } else {
                    return {error: 'Authentication failed'};
                }
            }
        } catch (error) {
            log.error('Error authenticating user:', error);
            throw new ValidationError('Error authenticating user');
        }

    }

    async getUsersPublicData() {
        const users = await this.userRepository.getAll();
        const result = [];
        for (const user of users) {
            log.debug("getUsersPublicData" + user.user_id, user.name, user.surname, user.email, user.role, user.created_at);
            result.push({
                user_id: user.user_id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            });
        }
        return result;
    }
}
