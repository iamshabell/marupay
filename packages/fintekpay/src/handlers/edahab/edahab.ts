import axios from 'axios';
import { z } from 'zod';
import { generateUuid } from '../../utils/generateUuid';
import { defineHandler } from '../../handler';
import * as API from './api';
import { hashSecretKey } from './hash';
import { Ctx, Options } from './types';

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
            request: 'https://edahab.net/api/api/issueinvoice?hash=',
        },
    },
    request: async ({ ctx, options }: { ctx: Ctx, options: Options }) => {
        const { amount, accountNumber, currency, description } = options;
        const { links, apiKey, merchantId } = ctx;
        
        const hashCode = hashSecretKey({ 
            apiKey: ctx.apiKey, 
            edahabNumber: accountNumber, 
            amount, 
            currency, 
            agentCode: ctx.merchantId, 
            description}, ctx.secretKey);

        const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request + hashCode, {
            apiKey: apiKey,
            edahabNumber: accountNumber,
            amount: amount,
            currency: currency,
            agentCode: merchantId,
            description: description,
        });

        const { TransactionId, InvoiceStatus, StatusCode, StatusDescription } = response.data;

        const responseCode = StatusCode.toString();

        if (responseCode !== '0') {
            console.log(StatusDescription);
            throw Error(responseCode);
        }

        return {
            transactionId: TransactionId,
            paymentStatus: InvoiceStatus,
            referenceId: generateUuid(),
        };
    },

});

export type EdahabHandler = ReturnType<typeof createEdahabHandler>;