import CryptoJS from 'crypto-js';

const secretKey = 'mfmvk567';

export function encryptIpAddress(ipAddress) {
    return CryptoJS.AES.encrypt(ipAddress, secretKey).toString();
}

export function decryptIpAddress(encryptedIpAddress) {
    const bytes = CryptoJS.AES.decrypt(encryptedIpAddress, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}
