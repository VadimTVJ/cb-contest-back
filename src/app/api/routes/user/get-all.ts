import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import { userSelectors } from '../../../entities/user';
import { withTmaVerify } from '../../../../shared/tma-verify-hook';

const bodySchema = Type.Object({
  take: Type.Optional(Type.Number({
    maximum: 25,
  })),
  skip: Type.Optional(Type.Number()),
});

type Request = { Body: Static<typeof bodySchema> };

export const getUsersRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/user.getAll',
  schema: {
    body: bodySchema,
  },
  preHandler: [withTmaVerify],

  handler: async (request, reply) => {
    const { take = 10, skip = 0 } = request.body;

    const users = await userSelectors.selectUsers({
      orderBy: {
        receivedGiftsCount: 'desc',
      },
      take,
      skip,
    });

    return reply.send(users);
  },
};
