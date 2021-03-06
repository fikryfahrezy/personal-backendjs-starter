import type { Server } from 'http';
import type { FastifyInstance } from 'fastify';
import app from '../../src/config/app';
import {
  fileDir,
  getExamples,
  getExample,
  postExample,
  postFileExample,
  getPrivateExamples,
  getAdminExamples,
} from '../component';

let server: Server = null;
let appServer: FastifyInstance = null;

beforeAll(async () => {
  appServer = app();
  await appServer.ready();
  server = appServer.server;
});

afterAll(async () => {
  await appServer.close();
});

describe('Post Data', () => {
  test('Success', async () => {
    const { status, headers, body } = await postExample(server, { name: 'name' });

    expect(status).toBe(201);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);
  });

  test('Fail, Validation Fail', async () => {
    const { status, headers, body } = await postExample(server, {});

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });
});

describe('Get Data', () => {
  test('Success, Without Query', async () => {
    const query = '';

    const { status, headers, body } = await getExamples(server, query);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);
  });

  test('Success, With Query `?limit=1`', async () => {
    const query = '?limit=1';

    const { status, headers, body } = await getExamples(server, query);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(1);
  });
});

describe('Get Single Data', () => {
  test('Success, Found Single Data', async () => {
    const { status, headers, body } = await getExample(server, 1);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);
  });

  test('Fail, Data Not Found', async () => {
    const { status, headers, body } = await getExample(server, 100);

    expect(status).toBe(404);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });
});

describe('Post File', () => {
  test('Success', async () => {
    const { status, headers, body } = await postFileExample(server, [{ fileDir, field: 'file' }]);

    expect(status).toBe(201);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);
  });

  test('Fail, File Not Provided', async () => {
    const { status, headers, body } = await postFileExample(server);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });
});

describe('Get Private Data', () => {
  test('Success', async () => {
    const authKey = '0';

    const { status, headers, body } = await getPrivateExamples(server, authKey);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);
  });

  test('Fail, Wrong Authorization Key', async () => {
    const authKey = '2';

    const { status, headers, body } = await getPrivateExamples(server, authKey);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });

  test('Fail, Invalid Authorization Key', async () => {
    const authKey = 'aaa';

    const { status, headers, body } = await getPrivateExamples(server, authKey);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });

  test('Fail, Authorization Key Not Given', async () => {
    const { status, headers, body } = await getPrivateExamples(server);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });
});

describe('Get Admin Data', () => {
  test('Success', async () => {
    const authKey = '1';

    const { status, headers, body } = await getAdminExamples(server, authKey);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);
  });

  test('Fail, Wrong Authorization Key', async () => {
    const authKey = '2';

    const { status, headers, body } = await getAdminExamples(server, authKey);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });

  test('Fail, Invalid Authorization Key', async () => {
    const authKey = 'aaa';

    const { status, headers, body } = await getAdminExamples(server, authKey);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });

  test('Fail, Authorization Key Not Given', async () => {
    const { status, headers, body } = await getAdminExamples(server);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);
  });
});
