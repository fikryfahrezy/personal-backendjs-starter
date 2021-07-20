import type {
  ApiKeyHeader,
  IdRequestParams,
  PostRequestBody,
  FileRequestBody,
} from '../../types/schema';
import type { Request, RequestHandler } from '../../types/fasitify';
import { getIdService, getService, postFileService, postService } from './service';

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

export const getExample: RequestHandler<Request> = function getExample(_, res): void {
  const resData = getService();

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
> = function getPrivateExample(_, res): void {
  const resData = getService();

  res.status(200).header('Content-Type', 'application/json; charset=utf-8').send({
    code: 200,
    success: true,
    message: 'get success',
    data: resData,
  });
};
