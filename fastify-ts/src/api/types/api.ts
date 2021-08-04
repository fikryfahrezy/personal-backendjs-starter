type UserRole = 'USER' | 'ADMIN';

type UserToken = {
  userId: number;
  type: number;
};

type SearchQuery = {
  offset: number;
  limit: number;
};

type ApiType = {
  UserRole: UserRole;
  UserToken: UserToken;
  SearchQuery: SearchQuery;
};

export default ApiType;
