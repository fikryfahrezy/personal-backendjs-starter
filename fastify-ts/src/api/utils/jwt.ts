import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/util';
import type ApiType from '../types/api';
import { ErrorResponse } from './error-handler';

const { JWT_TEMP_TOKEN, JWT_TEMP_TOKEN_EXP } = process.env;

export const verifyTokenExample: (
  who: ApiType['UserRole'],
  token?: string,
) => ApiType['UserToken'] = function verifyToken(who, token) {
  const user = {
    userId: 1,
    type: 1,
  };

  if (!token) throw new ErrorResponse('forbidden', 403);

  const numToken = Number(token);

  if (Number.isNaN(numToken)) throw new ErrorResponse('forbidden', 403);
  else {
    switch (who) {
      case 'USER':
        if (numToken >= 2) throw new ErrorResponse('forbidden', 403);
        break;
      case 'ADMIN':
        if (numToken !== 1) throw new ErrorResponse('forbidden', 403);
        break;
      default:
        throw new ErrorResponse('forbidden', 403);
    }
  }

  return user;
};

export const issueJwt: (
  userId: number,
  type: number | ApiType['UserRole'],
) => string = function issueJwt(userId, type) {
  let userType = 0;

  if (typeof type === 'number') userType = type;
  else
    switch (type) {
      case 'ADMIN':
        userType = 2;
        break;
      default:
        userType = 0;
    }

  const token = jwt.sign(
    {
      user_id: userId,
      type: userType,
    },
    JWT_TEMP_TOKEN as string,
    { expiresIn: JWT_TEMP_TOKEN_EXP },
  );

  return token;
};

// Decode JWT if using JWT for authentication
const verifyJwt: (token: string) => ApiType['UserToken'] = function verifyJwt(token) {
  /**
   * Ref: How to properly use Bearer tokens?
   * https://stackoverflow.com/a/42983914/12976234
   */
  const foundToken = RegExp(/Bearer\s((.*)\.(.*)\.(.*))/).exec(token);
  if (!foundToken) throw new ErrorResponse('forbidden', 403);

  const jwtToken = foundToken[1];
  if (!jwtToken) throw new ErrorResponse('forbidden', 403);

  const decoded = jwt.verify(jwtToken, JWT_TEMP_TOKEN as string);
  const { user_id: userId, type, exp } = decoded as JwtPayload;

  if (exp < Math.floor(Date.now() / 1000)) throw new ErrorResponse('forbidden', 403);

  return { userId, type };
};

// Decode JWT payload if using JWT for authentication
export const verifyToken: (
  who: ApiType['UserRole'],
  token?: string,
) => ApiType['UserToken'] = function verifyToken(who, token) {
  if (!token) throw new ErrorResponse('forbidden', 403);

  const user = verifyJwt(token);

  if (!user) throw new ErrorResponse('forbidden', 403);
  else {
    switch (who) {
      case 'USER':
        if (user.type >= 2) throw new ErrorResponse('forbidden', 403);
        break;
      case 'ADMIN':
        if (user.type !== 1) throw new ErrorResponse('forbidden', 403);
        break;
      default:
        throw new ErrorResponse('forbidden', 403);
    }
  }
  return user;
};
