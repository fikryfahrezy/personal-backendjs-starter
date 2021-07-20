export const requestHeaders = {
  private: {
    $ref: '#ApiKeyHeader',
  },
};

export const requestParams = {
  id: {
    $ref: '#RouteIdParam',
  },
};

/**
 * The order of the keys is following the order of the POST / PATCH
 * routes in Postman
 */
export const requestBody = {
  postBody: {
    required: ['name'],
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
    additionalProperties: false,
  },
  postFile: {
    required: ['file'],
    type: 'object',
    properties: {
      file: {
        type: 'array',
        items: {
          $ref: '#MultiPartSchema',
        },
      },
    },
    additionalProperties: false,
  },
};

/**
 * The order of the keys is following the order of the routes in Postman
 */
export const responses = {
  datas: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                data: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    ],
  },
  data: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
              },
              data: {
                type: 'string',
              },
            },
          },
        },
      },
    ],
  },
};
