import {generateHash, generatedUserId} from '../../utils/randomCode.js';
import * as assert from "assert";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

describe("randomString Util", () => {

    test("should return random string with length 5", () => {
        const GENERATED_LENGTH = 5;

        const result = generateHash(GENERATED_LENGTH);

        expect(typeof result).toBe("string");
        expect(result.length).toBe(GENERATED_LENGTH);
        expect(result).not.toBe("");

    });


    it("should return empty string for UNDEFINED length", () => {
        const result = generateHash(undefined);

        assert.equal(result, "")
    })

    it("should return empty string for INVALID length", () => {
        const result = generateHash("STRING");

        expect(typeof result).toBe("string");
        expect(result).toHaveLength(0);
    })

    it("should return empty string for zero length", () => {
        const result = generateHash(0);
        expect(result).toBe("");
    });

    it("should return random string which consist only for valid characters", () => {
        const result = generateHash(10);

        for (const char of result) {
            expect(characters.includes(char)).toBeTruthy();
        }
    })

    it("should generate user IDs sequentially for the same sequence number", () => {
        const sequenceNumber = 1;
        const userId1 = generatedUserId(sequenceNumber);
        const userId2 = generatedUserId(sequenceNumber);
        expect(userId2).toBe(userId1 + 1);
    });

});

