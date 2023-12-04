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

type HandlerConfig = ZodSchema;
type HandlerRequest = ZodSchema;

type ConfigOptions<HandlerConfig extends ZodSchema, BaseConfigOptions> = z.infer<HandlerConfig> & BaseConfigOptions;
type RequestOptions<HandlerRequest extends ZodSchema, BaseRequestOptions> = z.infer<HandlerRequest> & BaseRequestOptions;

type HandlerHandlerParams = {
    schema: {
        config: HandlerConfig;
        request: HandlerRequest;
    };
    defaultConfig: Partial<ConfigOptions<HandlerConfig, BaseConfigOptions>>;
    request: (arg: { ctx: ConfigOptions<HandlerConfig, BaseConfigOptions>; options: RequestOptions<HandlerRequest, BaseRequestOptions> }) => Promise<IPaymentInfo>;
};

export const defineHandler = ({
    schema,
    defaultConfig,
    request
}: HandlerHandlerParams) => {
    return (config: Omit<ConfigOptions<HandlerConfig, BaseConfigOptions>, keyof Partial<ConfigOptions<HandlerConfig, BaseConfigOptions>>> & Partial<Partial<ConfigOptions<HandlerConfig, BaseConfigOptions>>>) => {
        const ctx = safeParse(schema.config, { ...defaultConfig, ...config }) as ConfigOptions<HandlerConfig, BaseConfigOptions>;
        const requestPayment = async (options: Parameters<typeof request>[0]['options']) => {
            options = safeParse(schema.request, options) as RequestOptions<HandlerRequest, BaseRequestOptions>;
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