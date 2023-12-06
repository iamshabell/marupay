import axios from 'axios';
import { z } from 'zod';
import { generateUuid } from '../../utils/generateUuid';
import { defineHandler } from '../../handler';
import * as API from './api';
import { hashSecretKey } from './hash';
import { PaymentCtx, PaymentOptions } from '../types';

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
        request: z.object({}),
        credit: z.object({}),
    },
    defaultConfig: {
        links: {
            baseUrl: 'https://edahab.net/api',
            requestUrl: '/api/issueinvoice?hash=',
            creditUrl: '/api/agentPayment?hash=',
        },
    },
    request: async ({ ctx, options }: { ctx: PaymentCtx, options: PaymentOptions }) => {
        const { amount, accountNumber, currency, description } = options;
        const { links, apiKey, merchantId } = ctx;

        const hashCode = hashSecretKey({ apiKey, edahabNumber: accountNumber, amount, currency, agentCode: merchantId, description }, ctx.secretKey);

        const requestUrl = `${links.baseUrl + links.requestUrl + hashCode}`;

        const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(requestUrl, {
            apiKey,
            edahabNumber: accountNumber,
            amount,
            currency,
            agentCode: merchantId,
            description,
        });

        const { TransactionId, InvoiceStatus, StatusCode, StatusDescription } = response.data;

        const responseCode = `${StatusCode}`;

        if (responseCode !== '0') {
            console.log(`${StatusDescription}`);
            throw responseCode;
        }

        return {
            transactionId: TransactionId,
            paymentStatus: InvoiceStatus,
            referenceId: generateUuid(),
        };
    },

    credit: async ({ ctx, options }: { ctx: PaymentCtx, options: PaymentOptions }) => {
        const { amount, accountNumber, currency, description } = options;
        const { links, apiKey } = ctx;
        const referenceId = generateUuid();

        const hashCode = hashSecretKey({ apiKey, phoneNumber: accountNumber, transactionAmount: amount, transactionId: referenceId, currency, description }, ctx.secretKey);

        const creditUrl = `${links.baseUrl + links.creditUrl + hashCode}`;

        const response = await axios.post<API.CreditPaymentReq, { data: API.CreditPaymentRes }>(creditUrl, {
            apiKey,
            phoneNumber: accountNumber,
            transactionAmount: amount,
            transactionId: referenceId,
            currency,
            description,
        })
            .catch((e) => {
                return {
                    data: {
                        PhoneNumber: accountNumber,
                        TransactionId: referenceId,
                        TransactionStatus: 'error',
                        TransactionMesage: e.message,
                    } as API.CreditPaymentRes,
                };
            });
            
        const { TransactionId, TransactionMesage, TransactionStatus } = response.data;

        const responseCode = `${TransactionStatus}`;

        if (responseCode === 'error') {
            console.log(`credit error: ${TransactionMesage}`);
            throw TransactionMesage;
        }

        return {
            transactionId: TransactionId,
            paymentStatus: TransactionStatus,
            referenceId: generateUuid(),
        };
    },
});

export type EdahabHandler = ReturnType<typeof createEdahabHandler>