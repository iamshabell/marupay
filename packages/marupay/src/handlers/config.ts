/**
 * Represents a configuration object for different payment providers.
 */
export type ConfigObject = {
    edahab?: {
        apiKey: string
        secretKey: string
        merchantId: string
    },
    waafi?: {
        apiKey: string
        secretKey: string
        merchantId: string
    },
}