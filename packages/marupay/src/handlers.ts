import { createEdahabHandler } from "./handlers/edahab";
import { createWaafiHandler } from "./handlers/waafi";

export const handlers = {
  edahab: createEdahabHandler,
  waafi: createWaafiHandler,
};

export type HandlerName = keyof typeof handlers;

/**
 * Retrieves the payment handler based on the provided handler name.
 * @param {HandlerName} HandlerName - The name of the handler.
 * @returns {PaymentHandler} The payment handler.
 * @throws {Error} If the provided handler name is not supported.
 */
export const getPaymentHandler = (HandlerName: HandlerName) => {
  if (!handlers[HandlerName]) {
    throw Error(`This Handler is not supported, supported Handlers: ${Object.keys(handlers).join(", ")}`);
  }

  return handlers[HandlerName];
};
