import { Currency } from './handlers/enums';
import { safeParse } from './utils/safeParser';
import { z, ZodSchema } from 'zod';

interface IPaymentInfo {
    transactionId: string
    paymentStatus: string;
    referenceId: string;
    raw: any;
}

export const baseConfigSchema = z.object({});
export type BaseConfigOptions = z.infer<typeof baseConfigSchema>;

export const basePurchaseSchema = z.object({
    accountNumber: z.string().startsWith('+'),
    amount: z.number(),
    currency: z.nativeEnum(Currency),
    description: z.string().optional(),
});

export type BasePurchaseOptions = z.infer<typeof basePurchaseSchema>;

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
        purchase:  HandlerPurchaseSchema;
        credit: HandlerCreditSchema;
    };
    defaultConfig: DefaultConfig;
    purchase:  (arg: { ctx: IConfig; options: IPurchase }) => Promise<IPaymentInfo>,
    credit: (arg: { ctx: IConfig; options: ICredit }) => Promise<IPaymentInfo>
};


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
    credit
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
        console.log(`config: ${JSON.stringify(config)}`);
        const ctx = safeParse(schema.config, { ...defaultConfig, ...config }) as IConfig;
        console.log(`parsed config: ${JSON.stringify(config)}`);
        const purchasePayment = async (options: Parameters<typeof purchase>['0']['options']) => {
            options = safeParse(basePurchaseSchema, options) as IPurchase;
            const paymentInfo = await purchase({ ctx, options });
            return {
                ...paymentInfo,
            };
        };
        
        const creditPayment = async (options: Parameters<typeof credit>['0']['options']) => {
            options = safeParse(basePurchaseSchema, options) as ICredit;
            console.log(`credit options: ${JSON.stringify(options)}`);
            const creditInfo = await credit({ ctx, options });
            return {
                ...creditInfo,
            };
        };

        return {
            purchase:  purchasePayment,
            credit: creditPayment
        };
    };
};