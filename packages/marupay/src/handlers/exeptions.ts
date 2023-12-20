class MaruPayException extends Error {
  constructor(public code: string, public message: string) {
    super(message);
    this.name = 'MaruPayException';
  }
}

/**
 * Represents an exception that occurs when there is an error with the vendor.
 */
class VendorErrorException extends MaruPayException {
    constructor(public code: string, public message: string) {
        super(code, message || 'Vendor error');
        this.name = 'VendorErrorException';
    }
}

class VendorAccountNotFound extends VendorErrorException {
  constructor(public message: string) {
    super('ACCOUNT-NOT-FOUND', message || 'Vendor account not found');
    this.name = 'VendorAccountNotFound';
  }
}

class VendorInsufficientBalance extends VendorErrorException {
  constructor(public message: string) {
    super('INSUFFICIENT-BALANCE', message || 'Vendor insufficient balance');
    this.name = 'VendorInsufficientBalance';
  }
}

export { MaruPayException, VendorErrorException, VendorAccountNotFound, VendorInsufficientBalance };
