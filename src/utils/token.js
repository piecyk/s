import _       from 'lodash';
import jwt     from 'jsonwebtoken';
import winston from 'winston';
import P       from 'bluebird';

import { JWT_SECRET, TOKEN_EXPIRATION } from './../config';


const log = function(msg) {winston.log('info', 'token:', msg);};
const jwtp = P.promisifyAll(jwt);

//TODO: store it in monog
//TODO: for now simple
export let create = function(user, req, res, next) {
  let token = jwt.sign({
    _id: user._id, email: user.email
  }, JWT_SECRET, { expiresInMinutes: TOKEN_EXPIRATION });

  return {token: token};
};


// var socket = io.connect('http://dupa', {
//  'query': 'token=' + your_jwt
// });
// socket.on("error", function(error) {
//   // redirect user to login page perhaps?
//   console.log("User's token has expired");
// });

export function authorize() {

  return (socket, next) => {
    const token = socket.handshake.query ? socket.handshake.query.token : null;
    token ?
      jwt.verifyAsync(token, JWT_SECRET).then(user => {
        socket.handshake.user = user;
        next();
      }).catch(err => next(new Error(err)))
    : next();
  };
}
