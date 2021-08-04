import type {
  RouteHandlerMethod,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RequestGenericInterface,
} from 'fastify';

export type Request<T extends RequestGenericInterface = Record<string, unknown>> = {
  Body: T['Body'];
  Querystring: T['Querystring'];
  Params: T['Params'];
  Headers: T['Headers'];
};

export type RequestHandler<T extends RequestGenericInterface> = RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  T
>;
