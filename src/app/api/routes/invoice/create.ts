import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import { withTmaVerify } from '../../../../shared/tma-verify-hook';
import { invoiceUseCases } from '../../../use-cases/invoice';

const bodySchema = Type.Object({
  storeGiftId: Type.Number(),
});

type Request = { Body: Static<typeof bodySchema> };

export const createInvoiceRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/invoice.create',
  schema: {
    body: bodySchema,
  },
  preHandler: [withTmaVerify],

  handler: async (request, reply) => {
    const { storeGiftId } = request.body;
    const { id: tgId } = request.tgUser;

    const invoice = await invoiceUseCases.create({
      tgId, storeGiftId,
    });

    return reply.send(invoice);
  },
};
