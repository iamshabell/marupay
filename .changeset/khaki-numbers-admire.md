---
"marupay": patch
---

- Added new vendor exceptions to handle specific error scenarios (commit: 51f1ec0)
- Added handling for the scenario when a vendor account is not found (commit: fc392ac)
- Introduced a ValidationError interface to handle validation errors in Purchase (commit: 0424299)
- Added a VendorInsufficientBalance exception and handled it in edahab and w (commit: 326915f)
- Refactored error handling in edahab.ts for better readability and maintainability (commit: ba8483d)
- Added unit tests for the new vendor exceptions to ensure they work as expected (commit: <commit_id>)
