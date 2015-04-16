import {create, login, update}   from './user';
import {emitToUsers}             from './userStream';
//import {UnauthorizedAccessError} from './../errorsUtil';
import * as token                from './../token';
import logger                    from 'mm-node-logger';

const l = logger(module);


export default function setUserRoutes(router) {


  router.post('/register', (req, res, next) => {
    create(req.body.email, req.body.password)
      .then((user) => {
        emitToUsers(user);
        res.json(token.create(user));
      }).catch((err) => {
        emitToUsers(err);
        return res.status(500).json(err);
      });});


  router.post('/login', (req, res, next) => {
    const email    = req.body.email;
    const password = req.body.password;

    return login(req.body.email, req.body.password)
      .then(
        (user) => {
          res.json(token.create(user));
        },
        (err) => {
          next(new Error(err));
        });
  });

  router.put('/api/v1/user/update', (req, res, next) => {
    const email    = req.body.email;
    const password = req.body.password;

    return update(req.body.email, req.body.password)
      .then(
        (user) => {
          res.json(token.create(user));
        },
        (err) => {
          next(new Error(err));
        });
  });

}
