export type AddedFileBody = {
  data?: Iterable<unknown> | AsyncIterable<unknown>;
  encoding: string;
  filename: string;
  limit: boolean;
  mimetype: string;
};

export type ApiKeyHeader = {
  authorization: string;
};

export type IdRequestParams = {
  id: string;
};

export type GetQuery = {
  page?: string;
  limit?: string;
};

export type PostRequestBody = {
  name: string;
};

export type FileRequestBody = {
  file: AddedFileBody[];
};
