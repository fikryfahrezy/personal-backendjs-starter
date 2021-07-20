export default {
  components: {
    schemas: {
      ApiKeyHeader: {
        $id: '#ApiKeyHeader',
        type: 'object',
        properties: {
          authorization: {
            type: 'string',
          },
        },
        required: ['authorization'],
      },
      RouteIdParam: {
        $id: '#RouteIdParam',
        required: ['id'],
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
        },
      },
      ApiResponse: {
        $id: '#ApiResponse',
        type: 'object',
        properties: {
          code: {
            type: 'number',
          },
          success: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
};
