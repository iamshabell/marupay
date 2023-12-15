export interface PurchasePaymentReq {
    apiKey: string;
    edahabNumber: string;
    amount: number;
    currency?: string;
    agentCode: string;
    ReturnUrl?: string;
}

export interface PurchasePaymentRes {
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


export type PurchaseData = {
    apiKey: string,
    currency: string,
    description?: string,
    amount?: number,
    agentCode?: string,
}

export type PurchasePaymentData = PurchaseData & { edahabNumber: string }
export type CreditPaymentData = PurchaseData & { phoneNumber: string, transactionAmount: number, transactionId: string }