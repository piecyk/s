import * as u                    from './user';
import * as token                from './../token';
import {emitToUsers}             from './userStream';
//import {UnauthorizedAccessError} from './../errorsUtil';
import _                         from 'lodash';
import logger                    from 'mm-node-logger';

const l = logger(module);

function resUser(user) {
  return _.assign(_.omit(user.toObject(), ['password', 'salt']),
                  token.create(user));
}

export default function setUserRoutes(router) {


  router.post('/register', (req, res, next) => {
    u.create(req.body.email, req.body.password).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      return res.status(500).json(err);
    });});


  router.post('/login', (req, res, next) => {
    const email    = req.body.email;
    const password = req.body.password;

    u.login(req.body.email, req.body.password).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      return res.status(500).json(err);
    });});


  router.put('/api/v1/user', (req, res, next) => {
    const email    = req.body.email;
    const password = req.body.password;

    u.update(req.body.email, req.body.password).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      return res.status(500).json(err);
    });});

  router.get('/api/v1/user', (req, res, next) => {
    u.findOne(req.user.email).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      return res.status(500).json(err);
    });});

}