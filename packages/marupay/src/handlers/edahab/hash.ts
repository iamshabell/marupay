import * as API from './api'
import * as CryptoJS from 'crypto-js';

/**
 * Hashes the given data and secret key using SHA256 algorithm.
 * @param data - The data to be hashed.
 * @param secretKey - The secret key used for hashing.
 * @returns The hashed value as a hexadecimal string.
 */
export const hashSecretKey = (data: API.PurchasePaymentData | API.CreditPaymentData, secretKey: string) => {
    const hash = JSON.stringify(data) + secretKey;

    return CryptoJS.SHA256(hash).toString(
        CryptoJS.enc.Hex
    );
}