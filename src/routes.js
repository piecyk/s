import express                   from 'express';
import _                         from 'lodash';
import {create, login}           from './user';
import {UnauthorizedAccessError} from './errorsUtil';
import * as token                from './token';
import {emitToUsers}             from './userStream';

let router = express.Router();

//curl -X POST -H "Content-Type: application/json" -d '{"email":"test@wp.pl","password":"test"}' http://localhost:3000/register
router.post('/register', (req, res, next) => {
  create(req.body.email, req.body.password)
    .then((user) => {
      emitToUsers(user);
      res.json(token.create(user));
    }, (err) => {
      emitToUsers(err);
      next(new Error(err));
    });});

//curl -X POST -H "Content-Type: application/json" -d '{"email":"test@wp.pl","password":"test"}' http://localhost:3000/login
router.post('/login', (req, res, next) => {
  const email    = req.body.email;
  const password = req.body.password;
  const error    = new UnauthorizedAccessError("401", {
    message: 'Invalid username or password'
  });

  if (_.isEmpty(email) || _.isEmpty(password)) {return next(error);}

  return login(req.body.email, req.body.password)
    .then(
      (user) => res.json(token.create(user)),
      (err) => next(error));});


router.get('/api/v1/ping', (req, res) => res.json(_.pick(req.user, '_id')));
router.get('/ping', (req, res) => {
  emitToUsers({msg: 'someone hit the publick helfcheck, ping'});
  res.json({msg: 'pong'});
});

export default router;
