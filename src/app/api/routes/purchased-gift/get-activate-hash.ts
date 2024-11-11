import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import { purchasedGiftSelectors } from '../../../entities/purchased-gift';
import { withTmaVerify } from '../../../../shared/tma-verify-hook';

const bodySchema = Type.Object({
  purchasedGiftId: Type.Number(),
});

type Request = { Body: Static<typeof bodySchema> };

export const getActivateHashRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/purchasedGift.getActivateHash',
  schema: {
    body: bodySchema,
  },
  preHandler: [withTmaVerify],

  handler: async (request, reply) => {
    const { purchasedGiftId } = request.body;
    const { id: tgId } = request.tgUser;

    const activateHash = await purchasedGiftSelectors.selectActivateHash(purchasedGiftId, tgId);

    return reply.send({ activateHash });
  },
};
