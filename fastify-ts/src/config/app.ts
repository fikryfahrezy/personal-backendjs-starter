import fastify, { FastifyServerOptions, FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyStatic from 'fastify-static';
import fastifyMultipart from 'fastify-multipart';
import fastifySwagger from 'fastify-swagger';
import fastifyRateLimit from 'fastify-rate-limit';
import { fastifyRequestContextPlugin } from 'fastify-request-context';
import fastifySensible from 'fastify-sensible';
import fastifyCookie from 'fastify-cookie';
import path from 'path';
import middie from 'middie';
import definitions from '../definitions';
import api from '../api';

const app = function app(opts: FastifyServerOptions = {}): FastifyInstance {
  const fastifyApp = fastify(opts);
  const ENV = process.env.NODE_ENV;
  const schemas = definitions.components.schemas as Record<string, unknown>;

  Object.entries(schemas).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(schemas, key)) {
      fastifyApp.addSchema(value);
    }
  });

  fastifyApp.register(middie);
  fastifyApp.register(fastifySensible, { errorHandler: false });
  fastifyApp.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    allowList: () => ENV === 'test' || ENV === 'development',
  });
  fastifyApp.register(fastifyCors);
  fastifyApp.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
      },
    },
  });
  fastifyApp.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  fastifyApp.register(fastifySwagger, {
    routePrefix: '/documentation',
    exposeRoute: ENV === 'development',
    mode: 'static',
    specification: {
      path: './docs/swagger-doc.yaml',
      postProcessor(swaggerObject) {
        return swaggerObject;
      },
      baseDir: '',
    },
  });
  fastifyApp.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  fastifyApp.register(fastifyMultipart, {
    throwFileSizeLimit: true,
    addToBody: true,
    sharedSchemaId: '#MultiPartSchema',
    limits: {
      fileSize: 5000000,
    },
  });
  fastifyApp.register(fastifyRequestContextPlugin, {
    defaultStoreValues: {
      user: null,
      query: null,
    },
  });

  fastifyApp.setNotFoundHandler((_, reply) => {
    const data = {
      code: 404,
      success: false,
      message: 'not found',
    };
    reply.status(404).header('Content-Type', 'application/json; charset=utf-8').send(data);
  });

  fastifyApp.setErrorHandler(function callback(err, _, reply) {
    const { statusCode, message } = err;
    const status = statusCode || 500;
    const data = {
      code: status,
      success: false,
      message,
    };

    this.log.error(message);
    reply.status(status).send(data);
  });

  fastifyApp.register(api, { prefix: '/api' });

  return fastifyApp;
};

export default app;
