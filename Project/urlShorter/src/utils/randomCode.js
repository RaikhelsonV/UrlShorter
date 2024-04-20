import crypto from 'crypto';

const allowedChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const store = {};

function generateHash(length) {
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, allowedChars.length);
        result += allowedChars[randomIndex];
    }

    return result;
}
function generatedUserId(sequenceNumber) {
    const sequence = store[sequenceNumber] || 0;
    store[sequenceNumber] = sequence + 1;
    return sequence + 1;
}

export { generateHash, generatedUserId };
