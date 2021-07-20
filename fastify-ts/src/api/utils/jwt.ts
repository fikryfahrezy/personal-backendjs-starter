import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/util';
import type CustModelType from '../types/model';
import { ErrorResponse } from './error-handler';

const { JWT_TEMP_TOKEN, JWT_TEMP_TOKEN_EXP } = process.env;

export const issueJwt: (
  userId: number,
  utilId: number,
  type: number | 'USER' | 'MERCHANT' | 'ADMIN',
) => string = function issueJwt(userId, utilId, type) {
  let userType = 0;

  if (typeof type === 'number') userType = type;
  else
    switch (type) {
      case 'MERCHANT':
        userType = 1;
        break;
      case 'ADMIN':
        userType = 2;
        break;
      default:
        userType = 0;
    }

  const token = jwt.sign(
    {
      user_id: userId,
      util_id: utilId,
      type: userType,
    },
    JWT_TEMP_TOKEN as string,
    { expiresIn: JWT_TEMP_TOKEN_EXP },
  );

  return token;
};

const verifyJwt: (
  token: string,
) => {
  userId: number;
  utilId: number;
  type: number;
} = function verifyJwt(token) {
  /**
   * Ref: How to properly use Bearer tokens?
   * https://stackoverflow.com/a/42983914/12976234
   */
  const foundToken = RegExp(/Bearer\s((.*)\.(.*)\.(.*))/).exec(token);
  if (!foundToken) throw new ErrorResponse('forbidden', 403);

  const jwtToken = foundToken[1];
  if (!jwtToken) throw new ErrorResponse('forbidden', 403);

  const decoded = jwt.verify(jwtToken, JWT_TEMP_TOKEN as string);
  const { user_id: userId, util_id: utilId, type, exp } = decoded as JwtPayload;

  if (exp < Math.floor(Date.now() / 1000)) throw new ErrorResponse('forbidden', 403);

  return { userId, utilId, type };
};

export const verifyToken: (
  who: 'USER' | 'ADMIN' | 'MERCHANT',
  token?: string,
) => CustModelType['UserToken'] = function verifyToken(who, token) {
  if (!token) throw new ErrorResponse('forbidden', 403);

  const user = verifyJwt(token);
  if (!user) throw new ErrorResponse('forbidden', 403);
  else {
    switch (who) {
      case 'USER':
        if (user.type >= 3) throw new ErrorResponse('forbidden', 403);
        break;
      case 'ADMIN':
        if (user.type >= 3 || user.type !== 2) throw new ErrorResponse('forbidden', 403);
        break;
      case 'MERCHANT':
        if (user.type >= 3 || user.type < 1) throw new ErrorResponse('forbidden', 403);
        break;
      default:
        throw new ErrorResponse('forbidden', 403);
    }
  }
  return user;
};
