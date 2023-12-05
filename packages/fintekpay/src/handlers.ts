import { createEdahabHandler } from './handlers/edahab';

export const handlers = {
    edahab: createEdahabHandler,
};

export type HandlerName = keyof typeof handlers;

export const getPaymentHandler = (HandlerName: HandlerName) => {
    if (!handlers[HandlerName]) {
        throw Error(`This Handler is not supported, supported Handlers: ${Object.keys(handlers).join(', ')}`);
    }
    return handlers[HandlerName];
};