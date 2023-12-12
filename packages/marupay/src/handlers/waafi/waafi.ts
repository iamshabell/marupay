import axios from 'axios';
import { z } from 'zod';
import { generateUuid } from '../../utils/generateUuid';
import { defineHandler } from '../../handler';
import * as API from './api';
import { PaymentCtx, PaymentOptions } from '../types';
import { prepareRequest } from './prepareRequest';
import { safeParse } from '../../utils/safeParser';
import { soRequestNumber } from 'handlers/constants';

const waafiRequest = z.object({
    accountNumber: soRequestNumber,
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
        request: waafiRequest,
        credit: z.object({
            accountType: z.enum(['MERCHANT', 'CUSTOMER']).optional(),
            ...waafiRequest.shape,
        }).optional(),
    },
    defaultConfig: {
        links: {
            baseUrl: 'https://api.waafipay.net/asm',
        },
    },
    request: async ({ ctx, options }: { ctx: PaymentCtx, options: PaymentOptions }) => {
        const parsedData = safeParse(waafiRequest.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace("+", '');
        const requestFn = async (url: string, data: API.RequestData) => {
            const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(url, data);
            const { responseCode, responseMsg, errorCode, params } = response.data;

            if (responseCode !== '2001' || params == null) {
                console.log(`WAAFI: API-RES: ${responseMsg} ERROR-CODE: ${errorCode}`);
                throw responseCode;
            }
            return {
                transactionId: params.transactionId,
                paymentStatus: params.state,
                referenceId: params.referenceId,
            };
        };

        const referenceId = generateUuid();
        const { links } = ctx;

        const requestUrl = `${links.baseUrl}`;
        const requestData = prepareRequest('request', { ...options, accountNumber }, ctx, referenceId);

        return await requestFn(requestUrl, requestData);
    },
    credit: async ({ ctx, options }: { ctx: PaymentCtx, options: PaymentOptions }) => {
        const parsedData = safeParse(waafiRequest.pick({ accountNumber: true }), { accountNumber: options.accountNumber });
        const accountNumber = parsedData.accountNumber.replace("+", '');
        const requestFn = async (url: string, data: API.RequestData) => {
            const response = await axios.post<API.CreditPaymentReq, { data: API.RequestPaymentRes }>(url, data);
            const { responseCode, responseMsg, errorCode, params } = response.data;

            if (responseCode !== '2001' || params == null) {
                console.log(`WAAFI: API-RES: ${responseMsg} ERROR-CODE: ${errorCode}`);
                throw responseCode;
            }
            return {
                transactionId: params.transactionId,
                paymentStatus: params.state,
                referenceId: referenceId.toString(),
            };
        };

        const referenceId = generateUuid();
        const { links } = ctx;

        const requestUrl = `${links.baseUrl}`;
        const requestData = prepareRequest('credit', { ...options, accountNumber }, ctx, referenceId);

        return await requestFn(requestUrl, requestData);
    },
});

export type WaafiHandler = ReturnType<typeof createWaafiHandler>