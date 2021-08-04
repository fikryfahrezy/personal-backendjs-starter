import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ApiKeyHeader } from '../types/schema';
import type ApiType from '../types/api';
import { ErrorResponse } from '../utils/error-handler';
import { verifyTokenExample, verifyToken } from '../utils/jwt';

export const exampleProtect: (
  who: ApiType['UserRole'],
) => (
  req: FastifyRequest<{ Headers: ApiKeyHeader | unknown }>,
  res: FastifyReply,
) => void = function exampleProtect(who) {
  return function protectHandler(req) {
    const token = req.headers.authorization;

    if (token && token === '2') throw new ErrorResponse('forbidden', 403);

    req.requestContext.set<ApiType['UserToken']>('usertoken', verifyTokenExample(who, token));
  };
};

// Protect middleware if using JWT for authentication
export const protect: (
  who: ApiType['UserRole'],
) => (
  req: FastifyRequest<{ Headers: ApiKeyHeader | unknown }>,
  res: FastifyReply,
) => void = function protect(who) {
  return function protectHandler(req) {
    req.requestContext.set<ApiType['UserToken']>(
      'usertoken',
      verifyToken(who, req.headers.authorization),
    );
  };
};
