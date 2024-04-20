import UrlService from '../../services/UrlService.js';
import UrlRepository from '../../repository/UrlRepository.js';
import ValidationError from "../../error/ValidationError.js";
import {jest} from "@jest/globals";

describe("UrlService tests", () => {
    let service;

    beforeAll(async () => {
        jest.unstable_mockModule("../../repository/UrlRepository.js", () => {
            return {
                default: class {
                }
            }
        });

        const UrlService = (await import("../../services/UrlService.js")).default;
        service = new UrlService();
    });

    describe('addUrl', () => {
        it('should throw ValidationError when adding URL with invalid type', async () => {
            const user = {user_id: 1};
            const payload = {
                name: 'Example',
                url: 'http://example.com',
                code: 'abchthhr123',
                type: 'permanent',
                expire_at: '2024-04-20 12:55:27.177'
            };
            await expect(service.addUrl(payload, user)).rejects.toThrow(ValidationError);
        });

        it('should throw Error when adding URL with invalid type', async () => {
            const user = {user_id: 1};
            const payload = {
                name: 'Example',
                url: 'http://example.com',
                code: 'abchthhr123',
                type: 'link',
                expire_at: '2024-12-31'
            };
            await expect(service.addUrl(payload, user)).rejects.toThrowError("Invalid type.");
        });
    });

    describe('addVisit', () => {
        it('should throw ValidationError when adding visits to URL', async () => {
            const user_id = 1;
            const code = 'rqtgga5GSa';
            await expect(service.addVisit(user_id, code)).rejects.toThrow(ValidationError);

        });
    });
});
