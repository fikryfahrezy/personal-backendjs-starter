/**
 * NOTE: How to Write Request to API Route function
 *
 * All routes that require `body` from the user, request function have `payload` in param
 *
 * If a route need payload from the user, the `payload` param is an object with a property that accepted
 * by the route `body` with all child properties is optional
 *
 * If the payload needed file payload, then the `payload` contains optional properties
 * `fields` and `files` (`fields` is object contain non-file property
 * accepted by the route, and `files` is an array of object with property file field name and file dir).
 *
 * If a route only need file payload, then the `payload` contain only optional `files` property
 *
 */

import type { Server } from 'http';
import supertest, { Test } from 'supertest';
import { PostRequestBody } from '../../src/api/types/schema';

type FilesType = { field?: string; fileDir?: string }[];

type SupertestReqType = {
  server: Server;
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  url: string;
  payload?:
    | { obj?: Record<string, unknown> }
    | { fields?: Record<string, string | number>; files?: FilesType };
  token?: string;
};

export const fileDir = './__test__/image-test.png';

const supertestReq = function supertestReq({
  server,
  type,
  url,
  payload,
  token,
}: SupertestReqType) {
  const init = supertest(server);
  const newUrl = `/api/v1${url}`;
  let req: Test;

  switch (type) {
    case 'POST':
      req = init.post(newUrl);
      break;
    case 'PATCH':
      req = init.patch(newUrl);
      break;
    case 'DELETE':
      req = init.delete(newUrl);
      break;
    case 'PUT':
      req = init.put(newUrl);
      break;
    default:
      req = init.get(newUrl);
  }

  if (token) req.set('authorization', token);

  if (payload) {
    if ('obj' in payload) {
      req.set('Content-Type', 'application/json');
      req.send(payload.obj);
    }

    if ('fields' in payload) {
      const { fields } = payload;

      if (fields) {
        Object.entries(fields).forEach(([key, value]) => {
          if (Object.prototype.hasOwnProperty.call(fields, key)) req.field(key, value);
        });
      }
    }

    if ('files' in payload) {
      const { files } = payload;
      if (files)
        files.forEach(({ field, fileDir }) => {
          req.attach(field, fileDir);
        });
    }
  }

  return req;
};

export const getExamples = function getExamples(server: Server) {
  return supertestReq({
    server,
    type: 'GET',
    url: '/example',
  });
};

export const getExample = function getExample(server: Server, exampleId: number) {
  return supertestReq({
    server,
    type: 'GET',
    url: `/example/${exampleId}`,
  });
};

export const postExample = function postExample(server: Server, data: Partial<PostRequestBody>) {
  return supertestReq({
    server,
    type: 'POST',
    url: '/example',
    payload: {
      obj: data,
    },
  });
};

export const postFileExample = function postFileExample(server: Server, data?: FilesType) {
  return supertestReq({
    server,
    type: 'POST',
    url: '/example/file',
    payload: {
      files: data,
    },
  });
};

export const getPrivateExamples = function getPrivateExamples(server: Server, token?: string) {
  return supertestReq({
    server,
    token,
    type: 'GET',
    url: '/example/private',
  });
};
