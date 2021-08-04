import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GetQuery } from '../types/schema';
import type ApiType from '../types/api';

const queryBuilder: () => (
  req: FastifyRequest<{ Querystring: GetQuery }>,
  res: FastifyReply,
) => void = function queryBuilder() {
  return function builder(req) {
    const { page, limit } = req.query;
    const pagination: { offset: number; limit: number } = {
      offset: 0,
      limit: 10,
    };
    const dataLimit = limit ? parseInt(limit, 10) : 10;

    /**
     * PAGINATION FORMULA
     * - RESULT = START = (PAGE - 1) * LIMIT && END = (PAGE * LIMIT) - 1 || END = PAGE * LIMIT
     */
    pagination.offset = page && Number(page) > 0 ? ((parseInt(page, 10) || 1) - 1) * dataLimit : 0;
    pagination.limit = dataLimit;

    const query: ApiType['SearchQuery'] = {
      ...pagination,
    };

    req.requestContext.set<ApiType['SearchQuery']>('query', query);
  };
};

export default queryBuilder;
