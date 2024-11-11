import { FastifyPluginCallback } from 'fastify';
import { getStoreGiftsRoute } from './get-all';
import { getStoreGiftRoute } from './get';

export const registerStoreGiftRoutes: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.route(getStoreGiftsRoute);
  fastify.route(getStoreGiftRoute);

  next();
};
