import { PaymentCtx, PaymentOptions } from '../types';
import * as API from './api';
import { generateUuid } from '../../utils/generateUuid';

/**
 * Prepares the request data for making a purchase or credit transaction.
 * 
 * @param paymentType - The type of payment: "request" or "credit".
 * @param data - The payment options.
 * @param ctx - The payment context.
 * @param referenceId - The reference ID for the transaction.
 * @returns The prepared request data.
 */
export const prepareRequest = (paymentType: "request" | "credit", data: PaymentOptions, ctx: PaymentCtx, referenceId: string): API.PurchaseData => {
    const serviceParams: API.PurchaseServiceParams = {
        merchantUid: ctx.merchantId,
        apiUserId: ctx.secretKey,
        apiKey: ctx.apiKey,
        transactionInfo: {
            amount: data.amount,
            currency: data.currency,
            description: data.description,
            invoiceId: generateUuid(),
            referenceId,
        },
        payerInfo: {
            accountNo: data.accountNumber,
            accountType: data.accountType,
        },
        browserInfo: 'browserInfo',
        paymentMethod: 'MWALLET_ACCOUNT',
    };

    const requestData: API.PurchaseData = {
        serviceName: paymentType == 'request' ? 'API_PURCHASE' : 'API_CREDITACCOUNT',
        serviceParams,
        schemaVersion: '1.0',
        requestId: '7102205824',
        timestamp: '2022-02-04 Africa',
        channelName: 'WEB',
    };

    return requestData;
}