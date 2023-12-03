import { safeParse } from 'utils/safeParser';
import { z, ZodSchema } from 'zod';

interface IPaymentInfo {
    transactionId: string;
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

export const defineHandler = <DriverConfigSchema extends ZodSchema,
    DriverRequestSchema extends ZodSchema, IConfig extends z.infer<DriverConfigSchema> & BaseConfigOptions,
    IRequest extends z.infer<DriverRequestSchema> & BaseRequestOptions, DefaultConfig extends Partial<IConfig>>({schema, defaultConfig, request}: {
        schema: {config: DriverConfigSchema, request: DriverRequestSchema},
        defaultConfig: DefaultConfig,
        request: (arg: { ctx: IConfig; options: IRequest }) => Promise<IPaymentInfo>;
    }) => {
    return (config: Omit<IConfig, keyof DefaultConfig> & Partial<DefaultConfig>) => {
        const ctx = safeParse(schema.config, { ...defaultConfig, ...config }) as IConfig;
        const requestPayment = async (options: Parameters<typeof request>['0']['options']) => {
            options = safeParse(schema.request, options) as IRequest;
            const paymentInfo = await request({ ctx, options });
            return {
                ...paymentInfo,
            };
        };

        return {
            request: requestPayment,
        };
    };
    }