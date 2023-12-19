import axios from 'axios';
import { WaafiHandler, createWaafiHandler } from './waafi'; // Import your WaafiHandler
import { Currency } from '../../handlers/enums';
import { VendorErrorException } from '../../handlers/exeptions';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Waafi Handler', () => {
    let handler: WaafiHandler;
    let options: any;

    beforeAll(() => {
        handler = createWaafiHandler({
            apiKey: 'yourApiKey',
            secretKey: 'yourSecretKey',
            merchantId: 'yourMerchantId',
        });
        options = {
            accountNumber: '+252611234569',
            amount: 500,
            currency: Currency.SLSH,
            description: 'Test purchase',
        };
    });

    it('returns the success payment response for purchase', async () => {
        const serverResponse = {
            responseCode: '2001',
            responseMsg: 'RCS_SUCCESS',
            params: {
                transactionId: '123456',
                state: 'APPROVED',
                referenceId: '987654',
            },
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        const result = await handler.purchase(options);

        expect(result.paymentStatus).toBe('APPROVED');
    });

    it('throws vendor errors for purchase accordingly', async () => {
        const serverResponse = {
            responseMsg: 'RCS_USER_REJECTED',
            errorCode: '5310',
            params: null,
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        await expect(handler.purchase(options)).rejects.toThrow(
            new VendorErrorException('5310', 'RCS_USER_REJECTED')
        );
    });

    it('returns the success payment response for credit', async () => {
        const serverResponse = {
            responseCode: '2001',
            responseMsg: 'RCS_SUCCESS',
            params: {
                transactionId: '5678',
                state: 'APPROVED',
                referenceId: '987654',
            },
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        const result = await handler.credit(options);

        expect(result.paymentStatus).toBe('APPROVED');
    });

    it('throws vendor errors for credit when account not found', async () => {
        const serverResponse = {
            responseCode: '5001',
            responseMsg: 'RCS_NO_ROUTE_FOUND',
            errorCode: 'E10105',
            params: null,
        };

        mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

        await expect(handler.credit(options)).rejects.toThrow(
            new VendorErrorException('5001', 'RCS_NO_ROUTE_FOUND')
        );
    });
});
