import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

const schemaValidation: (
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction,
) => void = ({ validationError }, res, done) => {
  if (validationError) {
    const { validationContext } = validationError;

    if (validationContext === 'headers') res.forbidden();

    res.unprocessableEntity();
  }

  done();
};

export default schemaValidation;
