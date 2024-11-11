import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { withTmaVerify } from '../../../../shared/tma-verify-hook';
import { userUseCases } from '../../../use-cases/user';

export const initUserRoute: RouteOptions<Server, IncomingMessage, ServerResponse> = {
  method: 'POST',
  url: '/user.init',
  preHandler: [withTmaVerify],

  handler: async (request, reply) => {
    const { tgUser } = request;

    await userUseCases.createUpdate({
      tgId: tgUser.id,
      firstName: tgUser.firstName,
      lastName: tgUser.lastName,
      hasPremium: tgUser.isPremium,
    });

    return reply.send(true);
  },
};
