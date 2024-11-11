import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import { FeedAction } from '@prisma/client';
import { feedSelectors } from '../../../entities/feed';
import { withTmaVerify } from '../../../../shared/tma-verify-hook';

const bodySchema = Type.Object({
  take: Type.Optional(Type.Number({
    maximum: 25,
  })),
  skip: Type.Optional(Type.Number()),
  storeGiftId: Type.Optional(Type.Number()),
  tgId: Type.Optional(Type.Number()),
  actions: Type.Optional(Type.Array(Type.Union([
    Type.Literal(FeedAction.buy_gift),
    Type.Literal(FeedAction.receive_gift),
    Type.Literal(FeedAction.sent_gift),
  ]))),
});

type Request = { Body: Static<typeof bodySchema> };

export const getFeedRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/feed.getAll',
  schema: {
    body: bodySchema,
  },
  preHandler: [withTmaVerify],

  handler: async (request, reply) => {
    const { id } = request.tgUser;
    const {
      take = 10, skip = 0, storeGiftId, tgId = id, actions = [FeedAction.buy_gift, FeedAction.receive_gift, FeedAction.sent_gift],
    } = request.body;

    const storeGifts = await feedSelectors.select({
      where: {
        tgId,
        purchasedGift: {
          storeGiftId,
        },
        action: {
          in: actions,
        },
      },
      take,
      skip,
    });

    return reply.send(storeGifts);
  },
};
