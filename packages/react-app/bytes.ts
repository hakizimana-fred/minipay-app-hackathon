import  crypto  from 'crypto'

export function generateRandomBytes32() {
    return '0x' + crypto.randomBytes(32).toString('hex');
}

