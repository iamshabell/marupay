import { createEdahabHandler } from './handlers/edahab';
import { createWaafiHandler } from './handlers/waafi';

export const handlers = {
    edahab: createEdahabHandler,
    waafi: createWaafiHandler,
};

export type HandlerName = keyof typeof handlers;

export const getPaymentHandler = (HandlerName: HandlerName) => {
    if (!handlers[HandlerName]) {
        throw Error(`This Handler is not supported, supported Handlers: ${Object.keys(handlers).join(', ')}`);
    }
    console.log(`CHOSEN HANDLER: ${HandlerName}`);
    
    return handlers[HandlerName];
};