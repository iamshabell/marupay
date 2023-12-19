import axios from 'axios';
import { EdahabHandler, createEdahabHandler } from './edahab'; // Import your EdahabHandler
import { Currency } from '../../handlers/enums';
import { VendorErrorException } from '../../handlers/exeptions';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Edahab Handler', () => {
    let handler: EdahabHandler;
    let options: any;

    beforeAll(() => {
        handler = createEdahabHandler({
            apiKey: 'yourApiKey',
            secretKey: 'yourSecretKey',
            merchantId: 'yourMerchantId',
        });
        options = {
            accountNumber: '+252611234569',
            amount: 500,
            currency: Currency.SLSH,
            description: 'Test purchase',
        }
    });

    it('returns the success payment response for purchase', async () => {
        const serverResponse = {
            InvoiceStatus: "Paid",
            TransactionId: "MP2234219.2220.A91111",
            InvoiceId: 10145,
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        const result = await handler.purchase(options);

        expect(result.paymentStatus).toBe('Paid');
    });

    it('throws vendor errors for purchase accordingly', async () => {
        const serverResponse = {
            InvoiceStatus: "Unpaid",
            TransactionId: "MP2234219.2220.A91111",
            InvoiceId: 10145,
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        await expect(handler.purchase(options)).rejects.toThrow(new VendorErrorException('1', 'Unpaid'));
    });

    it('returns the success payment response for credit', async () => {
        const serverResponse = {
            TransactionId: '5678',
            TransactionStatus: 'Approved',
            TransactionMesage: 'Credit successful',
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        const result = await handler.credit(options);

        expect(result.paymentStatus).toBe('Approved');
    });

    it('throws vendor errors for credit accordingly', async () => {
        const serverResponse = {
            TransactionId: '5678',
            TransactionStatus: 'Failed',
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        await expect(handler.credit(options)).rejects.toThrow(new VendorErrorException('Failed', 'EDAHAB-CREDIT-ERROR'));
    });

});
