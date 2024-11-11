import { FastifyPluginCallback } from 'fastify';
import { getActivateHashRoute } from './get-activate-hash';
import { getAvailableGiftsRoute } from './get-available';
import { getReceivedGiftsRoute } from './get-received';

export const registerPurchasedGiftRoutes: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.route(getAvailableGiftsRoute);
  fastify.route(getActivateHashRoute);
  fastify.route(getReceivedGiftsRoute);

  next();
};
