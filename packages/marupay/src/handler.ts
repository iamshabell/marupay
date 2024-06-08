import { Currency } from "./handlers/enums";
import { safeParse } from "./utils/safeParser";
import { z, ZodSchema } from "zod";

interface IPaymentInfo {
  transactionId: string;
  paymentStatus: string;
  referenceId: string;
  raw: any;
}

export const baseConfigSchema = z.object({});
export type BaseConfigOptions = z.infer<typeof baseConfigSchema>;

export const basePurchaseSchema = z.object({
  accountNumber: z.string().startsWith("+"),
  amount: z.number(),
  currency: z.nativeEnum(Currency),
  description: z.string().optional(),
  returnUrl: z.string().optional(),
});

export type BasePurchaseOptions = z.infer<typeof basePurchaseSchema>;

/**
 * Represents the parameters for a handler function.
 * @template HandlerConfigSchema - The schema for the handler's config.
 * @template HandlerPurchaseSchema - The schema for the handler's purchase options.
 * @template HandlerCreditSchema - The schema for the handler's credit options.
 * @template IConfig - The inferred type of the handler's config options.
 * @template IPurchase - The inferred type of the handler's purchase options.
 * @template ICredit - The inferred type of the handler's credit options.
 * @template DefaultConfig - The partial type of the default config options.
 */
type HandlerParams<
  HandlerConfigSchema extends ZodSchema,
  HandlerPurchaseSchema extends ZodSchema,
  HandlerCreditSchema extends ZodSchema,
  IConfig extends z.infer<HandlerConfigSchema> & BaseConfigOptions,
  IPurchase extends z.infer<HandlerPurchaseSchema> & BasePurchaseOptions,
  ICredit extends z.infer<HandlerCreditSchema> & BasePurchaseOptions,
  DefaultConfig extends Partial<IConfig>
> = {
  schema: {
    config: HandlerConfigSchema;
    purchase: HandlerPurchaseSchema;
    credit: HandlerCreditSchema;
  };
  defaultConfig: DefaultConfig;
  purchase: (arg: { ctx: IConfig; options: IPurchase }) => Promise<IPaymentInfo>;
  credit: (arg: { ctx: IConfig; options: ICredit }) => Promise<IPaymentInfo>;
};

/**
 * Defines a handler function that takes in configuration, purchase, and credit functions,
 * and returns an object with purchase and credit methods.
 *
 * @template HandlerConfigSchema - The schema for the handler configuration.
 * @template HandlerPurchaseSchema - The schema for the purchase options.
 * @template HandlerCreditSchema - The schema for the credit options.
 * @template IConfig - The inferred type of the handler configuration.
 * @template IPurchase - The inferred type of the purchase options.
 * @template ICredit - The inferred type of the credit options.
 * @template DefaultConfig - The partial type of the default configuration.
 *
 * @param {HandlerParams<HandlerConfigSchema, HandlerPurchaseSchema, HandlerCreditSchema, IConfig, IPurchase, ICredit, DefaultConfig>} params - The parameters for the handler function.
 * @returns {Function} - The handler function that takes in configuration and returns an object with purchase and credit methods.
 */
export const defineHandler = <
  HandlerConfigSchema extends ZodSchema,
  HandlerPurchaseSchema extends ZodSchema,
  HandlerCreditSchema extends ZodSchema,
  IConfig extends z.infer<HandlerConfigSchema> & BaseConfigOptions,
  IPurchase extends z.infer<HandlerPurchaseSchema> & BasePurchaseOptions,
  ICredit extends z.infer<HandlerCreditSchema> & BasePurchaseOptions,
  DefaultConfig extends Partial<IConfig>
>({
  schema,
  defaultConfig,
  purchase,
  credit,
}: HandlerParams<
  HandlerConfigSchema,
  HandlerPurchaseSchema,
  HandlerCreditSchema,
  IConfig,
  IPurchase,
  ICredit,
  DefaultConfig
>) => {
  return (config: Omit<IConfig, keyof DefaultConfig> & Partial<DefaultConfig>) => {
    const ctx = safeParse(schema.config, { ...defaultConfig, ...config }) as IConfig;
    const purchasePayment = async (options: Parameters<typeof purchase>["0"]["options"]) => {
      options = safeParse(basePurchaseSchema, options) as IPurchase;
      const paymentInfo = await purchase({ ctx, options });
      return {
        ...paymentInfo,
      };
    };

    const creditPayment = async (options: Parameters<typeof credit>["0"]["options"]) => {
      options = safeParse(basePurchaseSchema, options) as ICredit;
      const creditInfo = await credit({ ctx, options });
      return {
        ...creditInfo,
      };
    };

    return {
      purchase: purchasePayment,
      credit: creditPayment,
    };
  };
};
