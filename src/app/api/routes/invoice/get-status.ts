import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import { withTmaVerify } from '../../../../shared/tma-verify-hook';
import { invoiceSelectors } from '../../../entities/invoice';

const bodySchema = Type.Object({
  invoiceId: Type.Number(),
});

type Request = { Body: Static<typeof bodySchema> };

export const getInvoiceStatusRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/invoice.getStatus',
  schema: {
    body: bodySchema,
  },
  preHandler: [withTmaVerify],

  handler: async (request, reply) => {
    const { invoiceId } = request.body;

    const invoiceStatus = await invoiceSelectors.selectStatus(invoiceId);

    return reply.send({
      status: invoiceStatus,
    });
  },
};
