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

export { MaruPayException, VendorErrorException };
