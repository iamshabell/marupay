import axios from "axios";
import { EdahabHandler, createEdahabHandler } from "./edahab"; // Import your EdahabHandler
import { Currency } from "../../handlers/enums";
import { VendorAccountNotFound, VendorErrorException, VendorInsufficientBalance } from "../../handlers/exeptions";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Edahab Handler", () => {
  let handler: EdahabHandler;
  let options: any;

  beforeAll(() => {
    handler = createEdahabHandler({
      apiKey: "yourApiKey",
      secretKey: "yourSecretKey",
      merchantId: "yourMerchantId",
    });
    options = {
      accountNumber: "+252611234569",
      amount: 500,
      currency: Currency.SLSH,
      description: "Test purchase",
    };
  });

  it("returns the success payment response for purchase", async () => {
    const serverResponse = {
      InvoiceStatus: "Paid",
      TransactionId: "MP2234219.2220.A91111",
      InvoiceId: 10145,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const result = await handler.purchase(options);

    expect(result.paymentStatus).toBe("Paid");
  });

  it("throws vendor errors for purchase accordingly", async () => {
    const serverResponse = {
      InvoiceStatus: "Unpaid",
      TransactionId: "MP2234219.2220.A91111",
      InvoiceId: 10145,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(handler.purchase(options)).rejects.toThrow(new VendorErrorException("1", "Unpaid"));
  });

  it("returns the success payment response for credit", async () => {
    const serverResponse = {
      TransactionId: "5678",
      TransactionStatus: "Approved",
      TransactionMesage: "Credit successful",
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const result = await handler.credit(options);

    expect(result.paymentStatus).toBe("Approved");
  });

  it("throws vendor errors for credit accordingly", async () => {
    const serverResponse = {
      TransactionId: "5678",
      TransactionStatus: "Failed",
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(handler.credit(options)).rejects.toThrow(new VendorErrorException("Failed", "EDAHAB-CREDIT-ERROR"));
  });

  it("throws vendor errors for purchase when account not found", async () => {
    const serverResponse = {
      StatusCode: 3,
      RequestId: 2142,
      StatusDescription: "Validation Error",
      ValidationErrors: [
        {
          Property: "EDahabNumber",
          ErrorMessage: "Must be 9 digits and start with 65 or 66 or 62 or 64",
        },
      ],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(handler.purchase(options)).rejects.toThrow(
      new VendorAccountNotFound(serverResponse.ValidationErrors[0].ErrorMessage)
    );
  });

  it("throws vendor errors for purchase when customer insufficient balanace", async () => {
    const serverResponse = {
      StatusCode: 5,
      RequestId: 2142,
      StatusDescription: "Insufficient Customer Balance",
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(handler.purchase(options)).rejects.toThrow(
      new VendorInsufficientBalance(serverResponse.StatusDescription)
    );
  });

  it("throws vendor errors for credit when insufficient balanace", async () => {
    const serverResponse = {
      TransactionStatus: "Rejected",
      TransactionMesage: "You do not have sufficient balance.",
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(handler.credit(options)).rejects.toThrow(
      new VendorInsufficientBalance(serverResponse.TransactionMesage)
    );
  });
});
