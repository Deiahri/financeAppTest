import jwt from 'jsonwebtoken';

const debugging = true;
export function debug(...args) {
    debugging&&console.log(...args);
}

const jwtPrivateKey = '9SJd3mi2535_g92jgo#t4!askdolg03gk';
export function generateUserToken(email) {
    return jwt.sign({ email, iat: Date.now() }, jwtPrivateKey);
}

export function decryptUserToken(userToken) {
    try {
        return jwt.decode(userToken, jwtPrivateKey);
    } catch {
        return null;
    }
}

export async function sleep(ms) {
    await new Promise((func) => setTimeout(func, ms));
}

// console.log(decryptUserToken(generateUserToken('bruh@gmail.com')));
// console.log(generateUserToken('dytlin@gmail.com'));
