import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import createHttpError from 'http-errors';
import { storeGiftSelectors } from '../../../entities/store-gift';

const bodySchema = Type.Object({
  storeGiftId: Type.Number(),
});

type Request = { Body: Static<typeof bodySchema> };

export const getStoreGiftRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/storeGift.get',
  schema: {
    body: bodySchema,
  },

  handler: async (request, reply) => {
    const { storeGiftId } = request.body;

    const [storeGift] = await storeGiftSelectors.selectStoreGifts({
      where: {
        id: storeGiftId,
      },
    });
    if (!storeGift) throw createHttpError(404);

    return reply.send(storeGift);
  },
};
