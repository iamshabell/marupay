[![CI](https://github.com/iamshabell/marupay/actions/workflows/main.yml/badge.svg)](https://github.com/iamshabell/marupay/actions/workflows/main.yml)

# Marupay SDK

The Marupay SDK is a npm library that provides an easy-to-use interface for integrating with the multiple payment systems. 

## This SDK offers
- Edahab API
- Waafi API


## Installation

To use the Marupay SDK in your project, you can install it using npm:

```sh
npm install marupay
```

## Usage

To get started, import the necessary modules and configure the SDK with your credentials. The following example demonstrates how to set up the SDK for both eDahab and Waafi:

```typescript
import { config } from 'dotenv';
import express from 'express';
import { HandlerName, ConfigObject, getPaymentHandler, Currency } from 'marupay';
import { env } from 'process';

// Load environment variables from a .env file
config();

const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true }));

// Configuration for different payment handlers (e.g., edahab, waafi)
const paymentConfig: ConfigObject = {
    edahab: {
        apiKey: env.DAHAB_API_KEY!,
        secretKey: env.DAHAB_SECRET_KEY!,
        merchantId: env.DAHAB_AGENT_CODE!,
    },
    waafi: {
        apiKey: env.WAAFI_API_KEY!,
        secretKey: env.WAAFI_API_USER_ID!,
        merchantId: env.WAAFI_MERCHANT_KEY!,
    },
};

// Choose a payment handler
const chosenHandler: HandlerName = 'edahab';

app.get('/purchase', async (req, res) => {
    try {
        // Get the payment handler based on the chosen handler
        const handler = getPaymentHandler(chosenHandler)(paymentConfig[chosenHandler]!);

        // Make a purchase request
        const paymentInfo = await handler.request({
            accountNumber: "6512312341",
            amount: 500,
            currency: Currency.SLSH,
            description: "Test purchase",
        });

        res.send(paymentInfo);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/credit', async (req, res) => {
    try {
        // Get the payment handler based on the chosen handler
        const handler = getPaymentHandler(chosenHandler)(paymentConfig[chosenHandler]!);

        // Credit an account
        const paymentInfo = await handler.credit({
            accountNumber: "6512312341",
            amount: 1000,
            currency: Currency.SLSH,
            description: "Test credit",
        });

        res.send(paymentInfo);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
```

### Examples

The provided examples demonstrate how to use the Marupay SDK for both purchase and credit transactions with eDahab and Waafi payment handlers. Customize the route handlers according to your application's needs.

### Contributing
If you encounter any issues or have suggestions for improvements, feel free to contribute by opening [issues]('https://github.com/iamshabell/marupay/issues') or submitting [pull requests]('https://github.com/iamshabell/marupay/pulls') on the GitHub repository.

### License

This SDK is released under the MIT License. Feel free to use, modify, and distribute it as needed for your projects.
