import axios from 'axios';
import { z } from 'zod';
import { generateUuid } from '../../utils/generateUuid';
import { defineHandler } from '../../handler';
import * as API from './api';
import { PaymentCtx, PaymentOptions } from '../types';
import { prepareRequest } from './prepareRequest';
import { safeParse } from '../../utils/safeParser';
import { soPurchaseNumber } from 'handlers/constants';
import { VendorErrorException } from 'handlers/exeptions';

const waafiPurchase = z.object({
    accountNumber: soPurchaseNumber,
});

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
    purchase:  async ({ ctx, options }: { ctx: PaymentCtx, options: PaymentOptions }) => {
        const parsedData = safeParse(waafiPurchase.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace("+", '');
        const requestUrl = `${ctx.links.baseUrl}`;
        const PurchaseData = prepareRequest('request', { ...options, accountNumber }, ctx, generateUuid());

        return await sendRequest(requestUrl, PurchaseData);
    },
    credit: async ({ ctx, options }: { ctx: PaymentCtx, options: PaymentOptions }) => {
        const parsedData = safeParse(waafiPurchase.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace("+", '');
        const requestUrl = `${ctx.links.baseUrl}`;
        const PurchaseData = prepareRequest('credit', { ...options, accountNumber }, ctx, generateUuid());

        return await sendRequest(requestUrl, PurchaseData);
    },
});

export type WaafiHandler = ReturnType<typeof createWaafiHandler>

async function sendRequest(url: string, data: API.PurchaseData) {
    const response = await axios.post<API.PurchasePaymentReq, { data: API.PurchasePaymentRes }>(url, data);
    const { responseCode, responseMsg, errorCode, params } = response.data;

    if (responseCode !== '2001' || params == null) {
        console.log(`WAAFI: API-RES: ${responseMsg} ERROR-CODE: ${errorCode}`);
        throw new VendorErrorException(errorCode, responseMsg);
    }

    return {
        transactionId: params.transactionId,
        paymentStatus: params.state,
        referenceId: params.referenceId.toString(),
        raw: response.data,
    };
}
