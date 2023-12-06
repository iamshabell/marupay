import { config } from 'dotenv';
import express from 'express';
import { HandlerName, ConfigObject, getPaymentHandler} from 'fintekpay';
config();
const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true }));

const fintekpayConfiguration: ConfigObject = {
    edahab: {
        apiKey: "",
        secretKey: "",
        merchantId: "",
    },
};

const chosenHandler: HandlerName = 'edahab';

app.get('/purchase', async (req, res) => {
    try {
        const handler = getPaymentHandler(chosenHandler)(fintekpayConfiguration[chosenHandler]);

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

app.get('/credit', async (req, res) => {
    try {
        const handler = getPaymentHandler(chosenHandler)(fintekpayConfiguration[chosenHandler]);

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});