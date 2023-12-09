import { config } from 'dotenv';
import express from 'express';
import { HandlerName, ConfigObject, getPaymentHandler} from 'marupay';
import { env } from 'process';
config();
const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true }));

const marupayConfiguration: ConfigObject = {
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

const chosenHandler: HandlerName = 'edahab';
const chosenHandler2: HandlerName = 'waafi';

app.get('/purchaseEdahab', async (req, res) => {
    try {
        const handler = getPaymentHandler(chosenHandler)(marupayConfiguration[chosenHandler]!);

        const paymentInfo = await handler.request({
            accountNumber: "657502302",
            amount: 500,
            currency: "SLSH",
            description: "test payment",
        });

        res.send(paymentInfo);
    } catch (e) {
        console.log(e);
    }
});

app.get('/purchaseWaafi', async (req, res) => {
    try {
        const handler = getPaymentHandler(chosenHandler2)(marupayConfiguration[chosenHandler2]!);

        const paymentInfo = await handler.request({
            accountNumber: "252634034190",
            amount: 1500,
            currency: "SLSH",
            description: "test payment",
            accountType: 'CUSTOMER',
        });

        res.send(paymentInfo);
    } catch (e) {
        console.log(e);
    }
});

app.get('/creditEdahab', async (req, res) => {
    try {
        const handler = getPaymentHandler(chosenHandler)(marupayConfiguration[chosenHandler]!);

        const paymentInfo = await handler.credit({
            accountNumber: "657502302",
            amount: 1000,
            currency: "SLSH",
            description: "test payment",
        });

        res.send(paymentInfo);
    } catch (e) {
        console.log(e);
    }
});

app.get('/creditWaafi', async (req, res) => {
    try {
        const handler = getPaymentHandler(chosenHandler2)(marupayConfiguration[chosenHandler2]!);

        const paymentInfo = await handler.credit({
            accountNumber: "252634034190",
            amount: 1000,
            currency: "SLSH",
            description: "test payment",
        });

        res.send(paymentInfo);
    } catch (e) {
        console.log(e);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});