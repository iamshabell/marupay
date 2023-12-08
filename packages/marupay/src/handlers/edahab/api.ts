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

export interface CreditPaymentReq {
    apiKey?: string;
    phoneNumber: string;
    transactionAmount: number;
    currency?: string;
    transactionId: string;
}

export interface CreditPaymentRes {
    TransactionStatus: string;
    TransactionMesage: string;
    PhoneNumber: string;
    TransactionId: string;
}


export type RequestData = {
    apiKey: string,
    currency: string,
    description?: string,
    amount?: number,
    agentCode?: string,
}

export type RequestPaymentData = RequestData & { edahabNumber: string }
export type CreditPaymentData = RequestData & { phoneNumber: string, transactionAmount: number, transactionId: string }