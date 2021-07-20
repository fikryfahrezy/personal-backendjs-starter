import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import route from './routes';

const api = function api(
  instance: FastifyInstance,
  _: FastifyPluginOptions,
  done: HookHandlerDoneFunction,
): void {
  instance.register(route, { prefix: '/v1' });
  done();
};
export default api;
