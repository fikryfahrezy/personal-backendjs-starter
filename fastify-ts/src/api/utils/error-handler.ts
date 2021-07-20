import type { FastifyReply } from 'fastify';
import { JsonWebTokenError } from 'jsonwebtoken';

export class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: (err: ErrorResponse | unknown, res: FastifyReply) => void = (
  err,
  res,
) => {
  if (err instanceof ErrorResponse) {
    const { message, status } = err;
    switch (status) {
      case 400:
        res.badRequest(message);
        break;
      case 403:
        res.forbidden(message);
        break;
      case 404:
        res.notFound(message);
        break;
      case 422:
        res.unprocessableEntity(message);
        break;
      default:
        res.internalServerError('server error');
    }
  } else if (err instanceof JsonWebTokenError) res.forbidden();
  else if (err instanceof Error) res.unprocessableEntity(err.message);
  else throw new Error('...');
};
