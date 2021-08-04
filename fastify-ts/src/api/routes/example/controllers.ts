import type { Request, RequestHandler } from '../../types/fastify';
import type {
  ApiKeyHeader,
  IdRequestParams,
  GetQuery,
  PostRequestBody,
  FileRequestBody,
} from '../../types/schema';
import ApiType from '../../types/api';
import {
  getIdService,
  getService,
  postFileService,
  postService,
  getPrivateService,
} from './services';

export const postExample: RequestHandler<Request<{ Body: PostRequestBody }>> = function postExample(
  req,
  res,
): void {
  postService(req.body.name);

  res.status(201).header('Content-Type', 'application/json; charset=utf-8').send({
    code: 201,
    success: true,
    message: 'post success',
  });
};

export const getExample: RequestHandler<Request<{ Querystring: GetQuery }>> = function getExample(
  req,
  res,
): void {
  const query = req.requestContext.get<ApiType['SearchQuery']>('query');

  if (!query) {
    res.badRequest();

    return;
  }

  const resData = getService(query);

  res.status(200).header('Content-Type', 'application/json; charset=utf-8').send({
    code: 200,
    success: true,
    message: 'get success',
    data: resData,
  });
};

export const getIdExample: RequestHandler<
  Request<{ Params: IdRequestParams }>
> = function getIdExample(req, res): void {
  const resData = getIdService(Number(req.params.id));

  res.status(200).header('Content-Type', 'application/json; charset=utf-8').send({
    code: 200,
    success: true,
    message: 'get success',
    data: resData,
  });
};

export const postFileExample: RequestHandler<
  Request<{ Body: FileRequestBody }>
> = async function postFileExample(req, res): Promise<void> {
  await postFileService(req.body.file);

  res.status(201).header('Content-Type', 'application/json; charset=utf-8').send({
    code: 201,
    success: true,
    message: 'post success',
  });
};

export const getPrivateExample: RequestHandler<
  Request<{ Headers: ApiKeyHeader }>
> = function getPrivateExample(req, res): void {
  const userToken = req.requestContext.get<ApiType['UserToken']>('usertoken');

  if (!userToken) {
    res.unauthorized();

    return;
  }

  const resData = getPrivateService(userToken.userId);

  res.status(200).header('Content-Type', 'application/json; charset=utf-8').send({
    code: 200,
    success: true,
    message: 'get success',
    data: resData,
  });
};
