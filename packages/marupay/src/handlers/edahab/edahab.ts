import axios from 'axios';
import { ZodString, z } from 'zod';
import { generateUuid } from '../../utils/generateUuid';
import { defineHandler } from '../../handler';
import * as API from './api';
import { hashSecretKey } from './hash';
import { PaymentCtx, PaymentOptions } from '../types';
import { prepareRequest } from './prepareRequest';
import { SO_ACCOUNT_NUMBER, soPurchaseNumber } from '../constants'
import { safeParse } from '../../utils/safeParser';
import { VendorErrorException } from 'handlers/exeptions';

const edahabPurchase = z.object({
    accountNumber: soPurchaseNumber,
});

/**
 * Makes a purchase payment request.
 * 
 * @param url - The URL to send the request to.
 * @param data - The payment data.
 * @param referenceId - The reference ID for the payment.
 * @returns An object containing the transaction ID, payment status, reference ID, and raw response data.
 * @throws VendorErrorException if the response code is not '0'.
 */
const purchaseFn = async (url: string, data: API.PurchasePaymentData, referenceId: string) => {
    const response = await axios.post<API.PurchasePaymentReq, { data: API.PurchasePaymentRes }>(url, data);
    const { TransactionId, InvoiceStatus, StatusCode, StatusDescription } = response.data;
    const responseCode = `${StatusCode}`;
    if (responseCode !== '0') {
        console.log(`${StatusDescription}`);
        throw new VendorErrorException(responseCode, StatusDescription);
    }
    return {
        transactionId: TransactionId,
        paymentStatus: InvoiceStatus,
        referenceId,
        raw: response.data,
    };
};

/**
 * Makes a credit payment request to the specified URL using the provided data.
 * @param url - The URL to send the credit payment request to.
 * @param data - The data for the credit payment request.
 * @param referenceId - The reference ID for the credit payment.
 * @returns An object containing the transaction ID, payment status, reference ID, and raw response data.
 * @throws {VendorErrorException} If the credit payment response code is not 'Approved'.
 */
const creditFn = async (url: string, data: API.CreditPaymentData, referenceId: string) => {
    const response = await axios.post<API.CreditPaymentReq, { data: API.CreditPaymentRes }>(url, data);

    const { TransactionId, TransactionMesage, TransactionStatus } = response.data;
    const responseCode = `${TransactionStatus}`;

    if (responseCode !== 'Approved') {
        console.log(`credit error: ${TransactionMesage}`);
        throw new VendorErrorException(responseCode, 'EDAHAB-CREDIT-ERROR');
    }

    return {
        transactionId: TransactionId,
        paymentStatus: TransactionStatus,
        referenceId,
        raw: response.data,
    };
};

export const createEdahabHandler = defineHandler({
    schema: {
        config: z.object({
            apiKey: z.string(),
            secretKey: z.string(),
            merchantId: z.string(),
            links: z.object({
                baseUrl: z.string(),
                requestUrl: z.string(),
                creditUrl: z.string(),
            }),
        }),
        purchase: z.object({
            returnUrl: z.string().optional(),
            ...edahabPurchase.shape,
        }),
        credit: edahabPurchase,
    },
    defaultConfig: {
        links: {
            baseUrl: 'https://edahab.net/api',
            requestUrl: '/api/issueinvoice?hash=',
            creditUrl: '/api/agentPayment?hash=',
        },
    },
    purchase: async ({ ctx, options }) => {
        const parsedData = safeParse(edahabPurchase.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace(SO_ACCOUNT_NUMBER, '');
        const { links } = ctx;
        const referenceId = generateUuid();

        const requestData = prepareRequest('request', { ...options, accountNumber }, ctx, referenceId) as API.PurchasePaymentData;
        const hashCode = hashSecretKey(requestData, ctx.secretKey);

        const requestUrl = `${links.baseUrl + links.requestUrl + hashCode}`;

        return await purchaseFn(requestUrl, requestData, referenceId);
    },
    credit: async ({ ctx, options }) => {
        const parsedData = safeParse(edahabPurchase.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace(SO_ACCOUNT_NUMBER, '');
        const { links } = ctx;
        const referenceId = generateUuid();
        const requestData = prepareRequest('credit', { ...options, accountNumber, }, ctx, referenceId) as API.CreditPaymentData;

        const hashCode = hashSecretKey(requestData, ctx.secretKey);
        const creditUrl = `${links.baseUrl + links.creditUrl + hashCode}`;

        return await creditFn(creditUrl, requestData, referenceId);
    },
});

export type EdahabHandler = ReturnType<typeof createEdahabHandler>