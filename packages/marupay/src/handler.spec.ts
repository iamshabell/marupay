import { z } from 'zod';
import { defineHandler, BaseConfigOptions, BasePurchaseOptions } from './handler';
import { Currency } from './handlers/enums';

describe('defineHandler', () => {
    let handlerInstance: any;

    beforeAll(() => {
        const handler = defineHandler({
            schema: {
                config: z.object({
                    apiKey: z.string(),
                    secretKey: z.string(),
                    merchantId: z.string(),
                }),
                credit: z.object({}),
                purchase: z.object({}),
            },
            defaultConfig: {},
            purchase: async ({ ctx, options }) => {
                return {
                    transactionId: 'test-transaction-id',
                    paymentStatus: 'test-payment-status',
                    referenceId: 'test-reference-id',
                    raw: {},
                };
            },
            credit: async ({ ctx, options }) => {
                return {
                    transactionId: 'test-transaction-id-2',
                    paymentStatus: 'test-payment-status-2',
                    referenceId: 'test-reference-id-2',
                    raw: {},
                };
            },
        });

        handlerInstance = handler({
            apiKey: 'test-api-key',
            merchantId: 'test-merchant-id',
            secretKey: 'test-secret-key',
        });
    });
    it('should return an object with purchase and credit methods', () => {
        expect(handlerInstance).toBeDefined();
        expect(handlerInstance.purchase).toBeDefined();
        expect(handlerInstance.credit).toBeDefined();
    });

    describe('purchase', () => {
        it('should return the result of the purchase function', async () => {
            const result = await handlerInstance.purchase({
                accountNumber: "+2526512312341",
                amount: 500,
                currency: Currency.SLSH,
                description: "Test purchase",
            });

            expect(result).toEqual({
                transactionId: 'test-transaction-id',
                paymentStatus: 'test-payment-status',
                referenceId: 'test-reference-id',
                raw: {},
            });
        });
    });

    describe('credit', () => {
        it('should return the result of the credit function', async () => {
            const result = await handlerInstance.credit({
                accountNumber: "+2526512312341",
                amount: 500,
                currency: Currency.SLSH,
                description: "Test purchase",
            });

            expect(result).toEqual({
                transactionId: 'test-transaction-id-2',
                paymentStatus: 'test-payment-status-2',
                referenceId: 'test-reference-id-2',
                raw: {},
            });
        });
    });
});
