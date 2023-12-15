import { z } from "zod";

export const SO_ACCOUNT_NUMBER = '+252';

export const soPurchaseNumber = z.string().startsWith(SO_ACCOUNT_NUMBER);
