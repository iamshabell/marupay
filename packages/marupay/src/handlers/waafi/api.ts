export type PurchasePaymentReq = {
    accountNo: string;
    amount: number;
    currency: string;
    description: string;
}

export type CreditPaymentReq = {
    accountNo: string;
    amount: number;
    currency: string;
    description: string;
    accountType: string;
    accountHolder?: string;
}

export type PurchasePaymentRes = {
    schemaVersion: string;
    timestamp: string;
    requestId: string;
    sessionId?: string;
    responseCode: string;
    errorCode: string;
    responseMsg: string;
    params?: ResponseParams;
};

export type ResponseParams = {
    issuerApprovalCode: string;
    accountNo: string;
    accountType: string;
    accountholder: string;
    state: string;
    merchantCharges: string;
    customerCharges: string;
    referenceId: string;
    transactionId: string;
    accountExpDate: string;
    issuerTransactionId: string;
    txAmount: string;
};

export type PurchaseData = {
    schemaVersion: '1.0';
    requestId: '7102205824';
    timestamp: '2022-02-04 Africa';
    channelName: 'WEB';
    serviceName: string;
    serviceParams: PurchaseServiceParams;
}

export type PurchaseServiceParams = {
    merchantUid: string;
    apiUserId: string;
    apiKey: string;
    paymentMethod: string;
    browserInfo: string;
    payerInfo: PurchasePayerInfo;
    transactionInfo: PurchaseTransactionInfo;
}

export type PurchasePayerInfo = {
    accountNo: string;
    accountType?: string;
    accountHolder?: string;
}

export type PurchaseTransactionInfo = {
    referenceId: string;
    invoiceId: string;
    amount: number;
    currency: string;
    description?: string;
}