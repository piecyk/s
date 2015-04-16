import _          from 'lodash';
import winston    from 'winston';
import * as u     from './user';
import * as area  from './../user/userArea';
import * as token from './../utils/token';

const l = function(msg) {winston.log('info', 'userRoutes:', msg);};

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
      next(new Error(err));
    });});

  router.post('/login', (req, res, next) => {
    u.login(req.body.email, req.body.password).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  router.put('/api/v1/user', (req, res, next) => {
    u.update(req.user.email, req.body.password).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  router.get('/api/v1/user', (req, res, next) => {
    u.findOne(req.user.email).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  router.post('/api/v1/user/area', (req, res, next) => {
    area.create(req.user._id, req.body.loc[0], req.body.loc[1], req.body.radius).then(area => {
      res.json(area);
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

}
