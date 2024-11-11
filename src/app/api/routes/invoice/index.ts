import { FastifyPluginCallback } from 'fastify';
import { createInvoiceRoute } from './create';
import { getInvoiceStatusRoute } from './get-status';
import { invoiceWebhookRoute } from './webhook';

export const registerInvoiceRoutes: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.route(createInvoiceRoute);
  fastify.route(getInvoiceStatusRoute);
  fastify.route(invoiceWebhookRoute);

  next();
};
