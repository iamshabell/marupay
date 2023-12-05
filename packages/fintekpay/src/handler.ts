import { safeParse } from './utils/safeParser';
import { z, ZodSchema } from 'zod';

interface IPaymentInfo {
    transactionId: string
    paymentStatus: string;
    referenceId: string;
}

export const baseConfigSchema = z.object({});
export type BaseConfigOptions = z.infer<typeof baseConfigSchema>;

export const baseRequestSchema = z.object({
    accountNumber: z.string(),
    amount: z.number(),
    currency: z.string(),
    description: z.string().optional(),
});

export type BaseRequestOptions = z.infer<typeof baseRequestSchema>;

type HandlerParams<
    HandlerConfigSchema extends ZodSchema,
    HandlerRequestSchema extends ZodSchema,
    IConfig extends z.infer<HandlerConfigSchema> & BaseConfigOptions,
    IRequest extends z.infer<HandlerRequestSchema> & BaseRequestOptions,
    DefaultConfig extends Partial<IConfig>
> = {
    schema: {
        config: HandlerConfigSchema;
        request: HandlerRequestSchema;
    };
    defaultConfig: DefaultConfig;
    request: (arg: { ctx: IConfig; options: IRequest }) => Promise<IPaymentInfo>
};


export const defineHandler = <
    HandlerConfigSchema extends ZodSchema,
    HandlerRequestSchema extends ZodSchema,
    IConfig extends z.infer<HandlerConfigSchema> & BaseConfigOptions,
    IRequest extends z.infer<HandlerRequestSchema> & BaseRequestOptions,
    DefaultConfig extends Partial<IConfig>
>({ schema, defaultConfig, request }: HandlerParams<HandlerConfigSchema, HandlerRequestSchema, IConfig, IRequest, DefaultConfig>) => {
    return (config: Omit<IConfig, keyof DefaultConfig> & Partial<DefaultConfig>) => {
        console.log(`config: ${JSON.stringify(config)}`);
        const ctx = safeParse(schema.config, { ...defaultConfig, ...config }) as IConfig;
        console.log(`parsed config: ${JSON.stringify(config)}`);
        const requestPayment = async (options: Parameters<typeof request>['0']['options']) => {
            const paymentInfo = await request({ ctx, options });
            return {
                ...paymentInfo,
            };
        };

        return {
            request: requestPayment,
        };
    };
};