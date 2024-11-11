import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { checkDatabaseConnection } from '../../infrastructure/db';
import { registerUserRoutes } from './routes/user';
import { registerStoreGiftRoutes } from './routes/store-gift';
import { registerPurchasedGiftRoutes } from './routes/purchased-gift';
import { registerInvoiceRoutes } from './routes/invoice';
import { registerFeedRoutes } from './routes/feed';

export const createApiServer = () => {
  const fastify = Fastify();

  fastify.register(fastifyCors, { origin: '*' });

  fastify.get('/health', async (request, reply) => {
    const dbStatus = await checkDatabaseConnection()
      .then(() => true)
      .catch(() => false);

    return reply.send({
      app: 'alive!',
      db: dbStatus ? 'alive!' : 'not alive',
    });
  });

  fastify.register(registerStoreGiftRoutes);
  fastify.register(registerUserRoutes);
  fastify.register(registerPurchasedGiftRoutes);
  fastify.register(registerInvoiceRoutes);
  fastify.register(registerFeedRoutes);

  fastify.setErrorHandler((error, request, reply) => {
    if (!error.statusCode || error.statusCode === 500) {
      console.error('[api error]', error);

      reply.code(500);
      error.message = 'Oops, try again later';
    }
    reply.send(error);
  });

  return fastify;
};
