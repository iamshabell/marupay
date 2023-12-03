import axios from 'axios';
import { z } from 'zod';
import { generateUuid } from '../utils/generateUuid';
import { defineHandler } from 'handler';
import * as API from './api';
import { hashSecretKey } from './hash';

export const createEdahabHandler = defineHandler({
    schema: {
        config: z.object({
            apiKey: z.string(),
            secretKey: z.string(),
            merchantId: z.string(),
            links: z.object({
                request: z.string()
            }),
        }),
        request: z.object({}),
    },
    defaultConfig: {
        links: {
            request: 'https://edahab.net/api/issueinvoice?hash=',
        },
    },
    request: async ({ ctx, options }) => {
        const hashCode = hashSecretKey(options, ctx.secretKey);

        const { amount, accountNumber, currency, description} = options;
        const { links, apiKey, merchantId } = ctx;


        const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request + hashCode, {
            apiKey: apiKey,
            edahabNumber: accountNumber,
            amount: amount,
            currency: currency,
            agentCode: merchantId,
            description: description,
        });

        const { TransactionId, InvoiceStatus, StatusCode } = response.data;

        const responseCode = StatusCode.toString();

        if (responseCode !== '0') {
            throw Error(responseCode);
        }

        return {
            transactionId: TransactionId,
            paymentStatus: InvoiceStatus,
            referenceId: generateUuid(),
        };
    },

});