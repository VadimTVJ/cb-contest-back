import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import { storeGiftSelectors } from '../../../entities/store-gift';

const bodySchema = Type.Object({
  take: Type.Optional(Type.Number({
    maximum: 25,
  })),
  skip: Type.Optional(Type.Number()),
});

type Request = { Body: Static<typeof bodySchema> };

export const getStoreGiftsRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/storeGift.getAll',
  schema: {
    body: bodySchema,
  },

  handler: async (request, reply) => {
    const { take = 10, skip = 0 } = request.body;

    const storeGifts = await storeGiftSelectors.selectStoreGifts({
      take, skip,
    });

    return reply.send(storeGifts);
  },
};
