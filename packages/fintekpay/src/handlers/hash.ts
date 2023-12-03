import CryptoJS from 'crypto-js';

export const hashSecretKey = (data: any, secretKey: string) => {
    return CryptoJS.SHA256(JSON.stringify(data) + secretKey).toString(
        CryptoJS.enc.Hex
    );
}