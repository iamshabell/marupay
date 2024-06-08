export type PaymentCtx = {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  links: {
    baseUrl: string;
    requestUrl?: string;
    creditUrl?: string;
  };
} & {};

export type PaymentOptions = {} & {
  accountNumber: string;
  amount: number;
  currency: string;
  description?: string | undefined;
  accountType?: "MERCHANT" | "CUSTOMER";
  returnUrl?: string | undefined;
};
