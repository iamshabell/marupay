export type Ctx = {
    apiKey: string;
    secretKey: string;
    merchantId: string;
    links: {
        request: string;
    };
} & {}

export type Options = {} & {
    accountNumber: string;
    amount: number;
    currency: string;
    description?: string | undefined;
}