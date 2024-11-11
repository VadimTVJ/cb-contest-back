import { FastifyPluginCallback } from 'fastify';
import { initUserRoute } from './init';
import { getUsersRoute } from './get-all';
import { getUserRoute } from './get';

export const registerUserRoutes: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.route(initUserRoute);
  fastify.route(getUsersRoute);
  fastify.route(getUserRoute);

  next();
};
