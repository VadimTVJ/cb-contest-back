import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { withCryptoBotVerifyHook } from '../../../../shared/crypto-bot-verify-hook';
import { purchasedGiftUseCases } from '../../../use-cases/purchased-gift';

export const invoiceWebhookRoute: RouteOptions<Server, IncomingMessage, ServerResponse> = {
  method: 'POST',
  url: '/invoice.webhook',
  preHandler: [withCryptoBotVerifyHook],

  handler: async (request, reply) => {
    const body = request.body as any;

    if (body?.update_type === 'invoice_paid') {
      const invoiceId = body?.payload?.invoice_id;
      if (invoiceId) {
        await purchasedGiftUseCases.purchase({ invoiceId });
      }
    }

    return reply.send('');
  },
};
