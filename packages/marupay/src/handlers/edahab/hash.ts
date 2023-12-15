import * as API from './api'
import CryptoJS from 'crypto-js';

export const hashSecretKey = (data: API.PurchasePaymentData | API.CreditPaymentData, secretKey: string) => {
    const hash = JSON.stringify(data) + secretKey;

    return CryptoJS.SHA256(hash).toString(
        CryptoJS.enc.Hex
    );
}