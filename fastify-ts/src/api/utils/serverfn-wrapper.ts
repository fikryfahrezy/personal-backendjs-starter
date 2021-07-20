import type { Server, IncomingMessage, ServerResponse } from 'http';
import type { FastifyRequest, FastifyReply, RequestGenericInterface } from 'fastify';
import type { RequestHandler } from '../types/fasitify';
import { errorHandler } from './error-handler';

type PreHandlerFn<T extends RequestGenericInterface> = (
  req: FastifyRequest<T, Server, IncomingMessage>,
  res: FastifyReply<Server, IncomingMessage, ServerResponse, T, unknown>,
) => Promise<void> | void;

export const controllerWrapper = function controllerWrapper<T>(
  fn: RequestHandler<T>,
): RequestHandler<T> {
  return async function controllerWrapperFn(this, req, res) {
    try {
      const boundFn = fn.bind(this);
      await boundFn(req, res);
    } catch (err) {
      errorHandler(err, res);
    }
  };
};

export const handlerWrapper = function handlerWrapper<T>(fn: PreHandlerFn<T>): PreHandlerFn<T> {
  return async function handlerWrapperFn(req, res) {
    try {
      await fn(req, res);
    } catch (err) {
      errorHandler(err, res);
    }
  };
};
