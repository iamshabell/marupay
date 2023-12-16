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
        const paymentInfo = await handler.purchase({
            accountNumber: "+2526512312341", // must start with `+` followed by country code
            amount: 500,
            currency: Currency.SLSH,
            description: "Test purchase",
            // for web handlers, you can optionally provide a return URL
            returnUrl: "https://example.com/return", 
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
            accountNumber: "+2526512312341", // must start with `+` followed by country code
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