# marupay

## 0.2.6

### Patch Changes

- 32d93da: Tests for payment handler

## 0.2.5

### Patch Changes

- 3ea9530: - Added new vendor exceptions to handle specific error scenarios (commit: 51f1ec0)
  - Added handling for the scenario when a vendor account is not found (commit: fc392ac)
  - Introduced a ValidationError interface to handle validation errors in Purchase (commit: 0424299)
  - Added a VendorInsufficientBalance exception and handled it in edahab and w (commit: 326915f)
  - Refactored error handling in edahab.ts for better readability and maintainability (commit: ba8483d)
  - Added unit tests for the new vendor exceptions to ensure they work as expected (commit: <commit_id>)

## 0.2.4

### Patch Changes

- 0f88c2f: Jest Configuration
  Unit tests for both eDahab and Waafi

## 0.2.3

### Patch Changes

- 8b6acff: Add jsdoc

## 0.2.2

### Patch Changes

- 49f3ed7: - Web support for edahab api
  - Vendor exception hadling error
  - refactor waafi handler

## 0.2.1

### Patch Changes

- 6fe65b7: rename `request` to `purchase` for better understanding

## 0.2.0

### Minor Changes

- 4b46401: Add `raw` field to return unfiltered response detail from the vendor's side

## 0.1.0

### Minor Changes

- d730139: - global account number validation to start with country code with (+)
  - updating the account number's format based on vendor's requirements

## 0.0.3

### Patch Changes

- e643a21: Add Currency enums to use on our currency field
  Docs for currency enums
  Docs for response details for both `request` and `credit` methods

## 0.0.2

### Patch Changes

- 3ea6bac: This is test for everything is releasing :)
