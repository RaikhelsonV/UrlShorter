import UserService from '../../services/UserService.js';
import UserRepository from "../../repository/UserRepository.js";
import ValidationError from "../../error/ValidationError.js";
import HashPassword from "../../utils/HashPassword.js";
import {jest} from "@jest/globals";
import {UserRoles} from "../../models/userRoles.js";

const NAME = 'John';
const SURNAME = 'Doe';
const PASSWORD = 'password123';
const EMAIL = 'john@example.com';

const USER_DATA = [
    {
        user_id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        role: 'admin',
        created_at: new Date().toISOString()
    }]

describe("UserService tests", () => {

    let service;

    beforeAll(async () => {
        jest.unstable_mockModule("../../repository/UserRepository.js", () => {
            return {
                default: class {
                }
            }
        });

        const UserService = (await import("../../services/UserService.js")).default;
        service = new UserService();
    });

    describe("User creation", () => {
        it("should create user", async () => {
            const user = await service.create(NAME, SURNAME, PASSWORD, EMAIL, UserRoles.USER);
            expect(user).toBeDefined();
            expect(user.name).toEqual(NAME);
        });

        it("should throw error for user which exist by EMAIL", async () => {
            await expect(service.create(NAME, SURNAME, PASSWORD, EMAIL, UserRoles.USER))
                .rejects.toThrow(ValidationError);
        });

        it("throw ValidationError without email", async () => {
            const ERROR_MESSAGE = "Failed to save user";
            await expect(service.create(NAME, SURNAME, PASSWORD, undefined, UserRoles.USER))
                .rejects.toThrow(new ValidationError(ERROR_MESSAGE));
        });

        it("throw ValidationError without password", async () => {
            const ERROR_MESSAGE = "data and salt arguments required";
            await expect(service.create(NAME, SURNAME, undefined, EMAIL, UserRoles.USER))
                .rejects.toThrow(new ValidationError(ERROR_MESSAGE));
        });
    });
    describe("User authentication", () => {
        it("should authenticate user with correct email and password", async () => {
            UserRepository.prototype.getUserByEmail = jest.fn().mockResolvedValueOnce({
                email: EMAIL,
                password: await HashPassword.hashPassword(PASSWORD)
            });
            const authenticatedUser = await service.authenticate(EMAIL, PASSWORD);
            expect(authenticatedUser.email).toEqual(EMAIL);
        });

        it("should return error if user is not found", async () => {
            const ERROR_MESSAGE = "User not found";
            const NONEXISTENT_EMAIL = "aaaa@js"
            UserRepository.prototype.getUserByEmail = jest.fn().mockResolvedValueOnce(undefined);
            const result = await service.authenticate(NONEXISTENT_EMAIL, PASSWORD);
            expect(result.error).toEqual(ERROR_MESSAGE);
        });

        it("should return error if password does not match", async () => {
            const ERROR_MESSAGE = 'Authentication failed';
            const WRONG_PASSWORD = '';
            UserRepository.prototype.getUserByEmail = jest.fn().mockResolvedValueOnce({
                email: EMAIL,
                password: await HashPassword.hashPassword('wrongPassword')
            });
            const result = await service.authenticate(EMAIL, WRONG_PASSWORD);
            expect(result.error).toEqual(ERROR_MESSAGE);
        });

        it("should throw ValidationError on database error", async () => {
            const ERROR_MESSAGE = 'Database error';
            const EMAIL = '';
            const PASSWORD = '';
            UserRepository.prototype.getUserByEmail = jest.fn().mockRejectedValueOnce(new Error(ERROR_MESSAGE));
            await expect(service.authenticate(EMAIL, PASSWORD)).rejects.toThrowError(ValidationError);
        });
    });

    describe("Get users public data", () => {

        it("should return public data of all users", async () => {
            UserRepository.prototype.getAll = jest.fn().mockResolvedValueOnce(USER_DATA);
            const publicUserData = await service.getUsersPublicData();
            expect(publicUserData).toHaveLength(USER_DATA.length);
            publicUserData.forEach((userData, index) => {
                expect(userData.user_id).toEqual(USER_DATA[index].user_id);
                expect(userData.name).toEqual(USER_DATA[index].name);
                expect(userData.surname).toEqual(USER_DATA[index].surname);
                expect(userData.email).toEqual(USER_DATA[index].email);
                expect(userData.role).toEqual(USER_DATA[index].role);
                expect(userData.created_at).toEqual(USER_DATA[index].created_at);
            });
        });

        it("should handle empty user data", async () => {
            UserRepository.prototype.getAll = jest.fn().mockResolvedValueOnce([]);
            const publicUserData = await service.getUsersPublicData();
            expect(publicUserData).toHaveLength(0);
        });

        it("should handle errors", async () => {
            const ERROR_MESSAGE = 'Database error';
            UserRepository.prototype.getAll = jest.fn().mockRejectedValueOnce(new Error(ERROR_MESSAGE));
            await expect(service.getUsersPublicData()).rejects.toThrowError();
        });
    });

    describe("delete user by Id", () => {
        it("User should be deleted", async () => {
            const USER_ID = "1";
            await service.delete(USER_ID);
            UserRepository.prototype.deleteUserAndAssociatedData = jest.fn().mockResolvedValueOnce();
            const userRepository = new UserRepository();
            const deletedUser = await userRepository.getUserById(USER_ID);
            expect(deletedUser).toBeUndefined;
        });

    })
});

