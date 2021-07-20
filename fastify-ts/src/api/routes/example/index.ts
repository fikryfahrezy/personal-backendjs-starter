import type { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';
import type { Request } from '../../types/fasitify';
import type {
  ApiKeyHeader,
  IdRequestParams,
  PostRequestBody,
  FileRequestBody,
} from '../../types/schema';
import { controllerWrapper, handlerWrapper } from '../../utils/serverfn-wrapper';
import { renameFiles } from '../../utils/file-management';
import { isBodyEmpty } from '../../middlewares/request-validation';
import schemaValidation from '../../middlewares/schema-validation';
import { exampleProtect } from '../../middlewares/protect-route';
import { requestBody, requestHeaders, requestParams, responses } from './schemas';
import {
  getExample,
  postExample,
  getIdExample,
  postFileExample,
  getPrivateExample,
} from './controllers';

const routes = function routes(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  donePlugin: HookHandlerDoneFunction,
): void {
  /**
   * The order of the keys is following the order of the routes in Postman
   */

  fastify.post<Request<{ Body: PostRequestBody }>>(
    '/',
    {
      attachValidation: true,
      schema: {
        body: requestBody.postBody,
        response: {
          200: { $ref: '#ApiResponse' },
          '4xx': { $ref: '#ApiResponse' },
          '5xx': { $ref: '#ApiResponse' },
        },
      },
      preHandler: schemaValidation,
    },
    controllerWrapper(postExample),
  );

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: responses.datas,
          '4xx': { $ref: '#ApiResponse' },
          '5xx': { $ref: '#ApiResponse' },
        },
      },
    },
    controllerWrapper(getExample),
  );

  fastify.get<Request<{ Params: IdRequestParams }>>(
    '/:id',
    {
      schema: {
        params: requestParams.id,
        response: {
          200: responses.data,
          '4xx': { $ref: '#ApiResponse' },
          '5xx': { $ref: '#ApiResponse' },
        },
      },
    },
    controllerWrapper(getIdExample),
  );

  fastify.post<Request<{ Body: FileRequestBody }>>(
    '/file',
    {
      attachValidation: true,
      schema: {
        body: requestBody.postFile,
        response: {
          200: { $ref: '#ApiResponse' },
          '4xx': { $ref: '#ApiResponse' },
          '5xx': { $ref: '#ApiResponse' },
        },
      },
      preValidation: (req, res, done) => {
        if (isBodyEmpty(req.body)) {
          res.unprocessableEntity();
          return;
        }

        req.body = {
          ...req.body,
          file: renameFiles(req.url, req.body.file) ?? req.body.file,
        };

        done();
      },
      preHandler: schemaValidation,
    },
    controllerWrapper(postFileExample),
  );

  fastify.get<Request<{ Headers: ApiKeyHeader }>>(
    '/private',
    {
      attachValidation: true,
      schema: {
        headers: requestHeaders.private,
        response: {
          200: responses.datas,
          '4xx': { $ref: '#ApiResponse' },
          '5xx': { $ref: '#ApiResponse' },
        },
      },
      preHandler: [schemaValidation, handlerWrapper(exampleProtect)],
    },
    controllerWrapper(getPrivateExample),
  );

  donePlugin();
};

export default routes;
