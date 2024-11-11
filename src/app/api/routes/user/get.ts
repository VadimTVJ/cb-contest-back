import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';
import createHttpError from 'http-errors';
import { userSelectors } from '../../../entities/user';

const bodySchema = Type.Object({
  tgId: Type.Number(),
});

type Request = { Body: Static<typeof bodySchema> };

export const getUserRoute: RouteOptions<Server, IncomingMessage, ServerResponse, Request> = {
  method: 'POST',
  url: '/user.get',
  schema: {
    body: bodySchema,
  },

  handler: async (request, reply) => {
    const { tgId } = request.body;

    const [user] = await userSelectors.selectUsers({
      where: { tgId },
    });
    if (!user) throw createHttpError(404, 'User not found');

    return reply.send(user);
  },
};
