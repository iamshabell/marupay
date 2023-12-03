export interface RequestPaymentReq {
    apiKey: string;
    edahabNumber: string;
    amount: number;
    currency?: string;
    agentCode: string;
    ReturnUrl?: string;
}

export interface RequestPaymentRes {
    InvoiceStatus: string;
    TransactionId: string;
    InvoiceId: number;
    StatusCode: number;
    RequestId: number;
    StatusDescription: string;
    ValidationErrors?: string;
}
