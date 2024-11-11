import {
  FastifyReply, FastifyRequest, HookHandlerDoneFunction,
} from 'fastify';
import createHttpError from 'http-errors';
import dayjs from 'dayjs';
import {
  parse, validate, User,
} from '@telegram-apps/init-data-node';

declare module 'fastify' {
  interface FastifyRequest {
    tgUser: User;
  }
}

export const withTmaVerify = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) => {
  const { sign } = request.headers;
  if (!sign || typeof sign !== 'string') throw createHttpError(401, 'Invalid payload');

  try {
    validate(sign, process.env.TG_BOT_TOKEN as string);
  } catch (error) {
    throw createHttpError(401, 'Invalid payload');
  }

  const authData = parse(sign);
  if (!authData.user) throw createHttpError(401, 'Invalid payload');

  const diff = dayjs().diff(authData.authDate, 'minutes');
  if (diff > 60) throw createHttpError(401, 'Expired payload');

  request.tgUser = authData.user;

  done();
};
