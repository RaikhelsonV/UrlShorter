import {encryptIpAddress, decryptIpAddress} from '../../utils/ipEncryption.js';

describe("CryptoJS Integration Tests", () => {
    test("should encrypt and decrypt IP address correctly", () => {
        const ipAddress = "192.168.0.1";
        const encryptedIpAddress = encryptIpAddress(ipAddress);
        const decryptedIpAddress = decryptIpAddress(encryptedIpAddress);

        expect(decryptedIpAddress).toBe(ipAddress);
    });
});