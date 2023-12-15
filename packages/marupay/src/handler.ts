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

export const baseRequestSchema = z.object({
    accountNumber: z.string().startsWith('+'),
    amount: z.number(),
    currency: z.nativeEnum(Currency),
    description: z.string().optional(),
});

export type BaseRequestOptions = z.infer<typeof baseRequestSchema>;

type HandlerParams<
    HandlerConfigSchema extends ZodSchema,
    HandlerRequestSchema extends ZodSchema,
    HandlerCreditSchema extends ZodSchema,
    IConfig extends z.infer<HandlerConfigSchema> & BaseConfigOptions,
    IRequest extends z.infer<HandlerRequestSchema> & BaseRequestOptions,
    ICredit extends z.infer<HandlerCreditSchema> & BaseRequestOptions,
    DefaultConfig extends Partial<IConfig>
> = {
    schema: {
        config: HandlerConfigSchema;
        request: HandlerRequestSchema;
        credit: HandlerCreditSchema;
    };
    defaultConfig: DefaultConfig;
    request: (arg: { ctx: IConfig; options: IRequest }) => Promise<IPaymentInfo>,
    credit: (arg: { ctx: IConfig; options: ICredit }) => Promise<IPaymentInfo>
};


export const defineHandler = <
    HandlerConfigSchema extends ZodSchema,
    HandlerRequestSchema extends ZodSchema,
    HandlerCreditSchema extends ZodSchema,
    IConfig extends z.infer<HandlerConfigSchema> & BaseConfigOptions,
    IRequest extends z.infer<HandlerRequestSchema> & BaseRequestOptions,
    ICredit extends z.infer<HandlerCreditSchema> & BaseRequestOptions,
    DefaultConfig extends Partial<IConfig>
>({ schema, defaultConfig, request, credit }: HandlerParams<HandlerConfigSchema, HandlerRequestSchema, HandlerCreditSchema, IConfig, IRequest, ICredit, DefaultConfig>) => {
    return (config: Omit<IConfig, keyof DefaultConfig> & Partial<DefaultConfig>) => {
        console.log(`config: ${JSON.stringify(config)}`);
        const ctx = safeParse(schema.config, { ...defaultConfig, ...config }) as IConfig;
        console.log(`parsed config: ${JSON.stringify(config)}`);
        const requestPayment = async (options: Parameters<typeof request>['0']['options']) => {
            options = safeParse(baseRequestSchema, options) as IRequest;
            const paymentInfo = await request({ ctx, options });
            return {
                ...paymentInfo,
            };
        };
        
        const creditPayment = async (options: Parameters<typeof credit>['0']['options']) => {
            options = safeParse(baseRequestSchema, options) as ICredit;
            console.log(`credit options: ${JSON.stringify(options)}`);
            const creditInfo = await credit({ ctx, options });
            return {
                ...creditInfo,
            };
        };

        return {
            request: requestPayment,
            credit: creditPayment
        };
    };
};