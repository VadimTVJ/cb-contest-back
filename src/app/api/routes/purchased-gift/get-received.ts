import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import { purchasedGiftSelectors } from '../../../entities/purchased-gift';
import { withTmaVerify } from '../../../../shared/tma-verify-hook';

const bodySchema = Type.Object({
  take: Type.Optional(Type.Number({
    maximum: 25,
  })),
  skip: Type.Optional(Type.Number()),
  tgId: Type.Number(),
});

type Request = { Body: Static<typeof bodySchema> };

export const getReceivedGiftsRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/purchasedGift.getReceived',
  schema: {
    body: bodySchema,
  },
  preHandler: [withTmaVerify],

  handler: async (request, reply) => {
    const { take = 10, skip = 0, tgId } = request.body;

    const storeGifts = await purchasedGiftSelectors.selectPurchasedGifts({
      where: {
        recipientTgId: tgId,
      },
      take,
      skip,
    });

    return reply.send(storeGifts);
  },
};
