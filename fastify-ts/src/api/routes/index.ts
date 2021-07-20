import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import example from './example';

const routeV1 = function routeV1(
  instance: FastifyInstance,
  _: FastifyPluginOptions,
  donePlugin: HookHandlerDoneFunction,
): void {
  instance.register(example, { prefix: '/example' });

  donePlugin();
};

export default routeV1;
