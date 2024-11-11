import {
  FastifyReply, FastifyRequest, HookHandlerDoneFunction,
} from 'fastify';
import createHttpError from 'http-errors';
import { createHash, createHmac } from 'crypto';

const checkSignature = (token: string, body: FastifyRequest['body'], headers: FastifyRequest['headers']) => {
  const secret = createHash('sha256').update(token).digest();
  const checkString = JSON.stringify(body);
  const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === headers['crypto-pay-api-signature'];
};

export const withCryptoBotVerifyHook = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) => {
  const trustedRequest = checkSignature(process.env.CB_TOKEN as string, request.body, request.headers);
  if (!trustedRequest) {
    throw createHttpError(400);
  }

  done();
};
