import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ApiKeyHeader } from '../types/schema';
import type CustModelType from '../types/model';
import { ErrorResponse } from '../utils/error-handler';
import { verifyToken } from '../utils/jwt';

export const protect: (
  who: 'USER' | 'MERCHANT' | 'ADMIN',
) => (
  req: FastifyRequest<{ Headers: ApiKeyHeader | unknown }>,
  res: FastifyReply,
) => void = function protect(who) {
  return function protectHandler(req) {
    req.requestContext.set<CustModelType['UserToken']>(
      'usertoken',
      verifyToken(who, req.headers.authorization),
    );
  };
};

export const exampleProtect: (
  req: FastifyRequest<{ Headers: ApiKeyHeader | unknown }>,
  res: FastifyReply,
) => void = function exampleProtect(req) {
  if (req.headers.authorization && req.headers.authorization === '2')
    throw new ErrorResponse('forbidden', 403);
};
