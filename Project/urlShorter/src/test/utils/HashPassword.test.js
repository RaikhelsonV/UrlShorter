 import HashPassword from '../../utils/HashPassword.js';
import bcrypt from 'bcrypt';
import {jest} from "@jest/globals";

const hashMock = jest.fn();
const compareMock = jest.fn();

jest.unstable_mockModule("bcrypt", () => {
    return {
        hash: hashMock,
        compare: compareMock
    }
})

describe('HashPassword', () => {
    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'password123';
            const hashedPassword = '$2b$10$Txj4LSgZ0op2JPWQkX7q0eX44yFtKWKQiCJOQ3zumXAhiThEp.rtS';

            const result = await HashPassword.hashPassword(password);

            expect(typeof result).toBe("string");
            expect(result).not.toBe("");

        });
    });

    describe('comparePasswords', () => {
        it('should compare passwords and return true if they match', async () => {

            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await HashPassword.comparePasswords(password, hashedPassword);

            expect(result).toBe(true);

        });

        it('should compare passwords and return false if they do not match', async () => {
            const password = 'password123';
            const incorrectPassword = 'password456';
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await HashPassword.comparePasswords(incorrectPassword, hashedPassword);

            expect(result).toBe(false);

        });
    });
});
