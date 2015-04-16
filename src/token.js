import _              from 'lodash';
import jwt            from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRATION } from './config';

//TODO: store it in monog
//TODO: for now simple
export let create = function(user, req, res, next) {
  let token = jwt.sign({
    _id: user._id, email: user.email
  }, JWT_SECRET, { expiresInMinutes: TOKEN_EXPIRATION });

  return {token: token};
};
