import { ZodSchema } from 'zod';

/**
 * Safely parses the given data using the provided parser.
 * If parsing is successful or the data is null, returns the parsed data.
 * If parsing fails, throws an error with the corresponding error message.
 * 
 * @template T - The type of the data being parsed.
 * @param {ZodSchema} parser - The parser to use for parsing the data.
 * @param {T} data - The data to be parsed.
 * @returns {T} - The parsed data.
 * @throws {Error} - If parsing fails, an error with the corresponding error message is thrown.
 */
export const safeParse = <T>(parser: ZodSchema, data: T): T => {
    const parsed = parser.safeParse(data);
    if (parsed.success || parsed == null) return parsed.data;
    
    const message = parsed.error.errors.map((err) => `${err.path[0]}: ${err.message}`).join('\n');
    throw new Error(message);
};