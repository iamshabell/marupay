export type PaymentCtx = {
    apiKey: string;
    secretKey: string;
    merchantId: string;
    links: {
        request: string;
    };
} & {}

export type PaymentOptions = {} & {
    accountNumber: string;
    amount: number;
    currency: string;
    description?: string | undefined;
}