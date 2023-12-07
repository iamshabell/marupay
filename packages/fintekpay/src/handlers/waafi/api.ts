export type RequestPaymentReq = {
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

export type RequestPaymentRes = {
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

export type RequestData = {
    schemaVersion: '1.0';
    requestId: '7102205824';
    timestamp: '2022-02-04 Africa';
    channelName: 'WEB';
    serviceName: string;
    serviceParams: RequestServiceParams;
}

export type RequestServiceParams = {
    merchantUid: string;
    apiUserId: string;
    apiKey: string;
    paymentMethod: string;
    browserInfo: string;
    payerInfo: RequestPayerInfo;
    transactionInfo: RequestTransactionInfo;
}

export type RequestPayerInfo = {
    accountNo: string;
    accountType?: string;
    accountHolder?: string;
}

export type RequestTransactionInfo = {
    referenceId: string;
    invoiceId: string;
    amount: number;
    currency: string;
    description?: string;
}