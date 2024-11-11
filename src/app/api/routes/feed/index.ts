import { FastifyPluginCallback } from 'fastify';
import { getFeedRoute } from './get-all';

export const registerFeedRoutes: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.route(getFeedRoute);

  next();
};
