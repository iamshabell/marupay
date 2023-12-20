import axios from 'axios';
import { z } from 'zod';
import { generateUuid } from '../../utils/generateUuid';
import { defineHandler } from '../../handler';
import * as API from './api';
import { prepareRequest } from './prepareRequest';
import { safeParse } from '../../utils/safeParser';
import { soPurchaseNumber } from '../../handlers/constants';
import { VendorAccountNotFound, VendorErrorException, VendorInsufficientBalance } from '../../handlers/exeptions';

const waafiPurchase = z.object({
    accountNumber: soPurchaseNumber,
});

/**
 * Sends a request to the specified URL with the provided data.
 * @param url - The URL to send the request to.
 * @param data - The data to send with the request.
 * @returns A Promise that resolves to an object containing the transaction ID, payment status, reference ID, and raw response data.
 * @throws {VendorErrorException} If the response code is not '2001' or the params are null.
 */
async function sendRequest(url: string, data: API.PurchaseData) {
    const response = await axios.post<API.PurchasePaymentReq, { data: API.PurchasePaymentRes }>(url, data);
    const { responseCode, responseMsg, errorCode, params } = response.data;
    
    if (responseMsg === 'RCS_NO_ROUTE_FOUND') {
        throw new VendorAccountNotFound('Must be a valid phone number');
    }

    if (errorCode === 'E101073') {
        throw new VendorInsufficientBalance(responseMsg);
    }

    if (responseCode !== '2001' || params == null) {
        throw new VendorErrorException(errorCode, responseMsg);
    }

    return {
        transactionId: params.transactionId,
        paymentStatus: params.state,
        referenceId: params.referenceId.toString(),
        raw: response.data,
    };
}

/**
 * Creates a handler for the Waafi API.
 * 
 * @param {object} options - The options for the handler.
 * @param {object} options.config - The configuration object.
 * @param {string} options.config.apiKey - The API key.
 * @param {string} options.config.secretKey - The secret key.
 * @param {string} options.config.merchantId - The merchant ID.
 * @param {object} options.config.links - The links object.
 * @param {string} options.config.links.baseUrl - The base URL.
 * @param {object} options.purchase - The purchase object.
 * @param {object} options.credit - The credit object.
 * @returns {Promise<any>} - The result of the handler.
 */
export const createWaafiHandler = defineHandler({
    schema: {
        config: z.object({
            apiKey: z.string(),
            secretKey: z.string(),
            merchantId: z.string(),
            links: z.object({
                baseUrl: z.string(),
            }),
        }),
        purchase: waafiPurchase,
        credit: z.object({
            accountType: z.enum(['MERCHANT', 'CUSTOMER']).optional(),
            ...waafiPurchase.shape,
        }).optional(),
    },
    defaultConfig: {
        links: {
            baseUrl: 'https://api.waafipay.net/asm',
        },
    },
    purchase:  async ({ ctx, options }) => {
        const parsedData = safeParse(waafiPurchase.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace("+", '');
        const requestUrl = `${ctx.links.baseUrl}`;
        const PurchaseData = prepareRequest('request', { ...options, accountNumber }, ctx, generateUuid());

        return await sendRequest(requestUrl, PurchaseData);
    },
    credit: async ({ ctx, options }) => {
        const parsedData = safeParse(waafiPurchase.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace("+", '');
        const requestUrl = `${ctx.links.baseUrl}`;
        const PurchaseData = prepareRequest('credit', { ...options, accountNumber }, ctx, generateUuid());

        return await sendRequest(requestUrl, PurchaseData);
    },
});

export type WaafiHandler = ReturnType<typeof createWaafiHandler>
