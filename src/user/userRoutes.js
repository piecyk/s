import _          from 'lodash';
import winston    from 'winston';
import * as u     from './user';
import * as area  from './../user/userArea';
import * as token from './../utils/token';

const log = function() {winston.log('info', 'userRoutes:', arguments);};

function resUser(user) {
  return _.omit(user.toObject(), ['password', 'salt']);
}

export default function setUserRoutes(router) {

  router.post('/register', (req, res, next) => {
    u.create(req.body.email, req.body.password).then(user => {
      let _user = _.assign(resUser(user), token.create(user));
      res.json(_user);
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  router.post('/login', (req, res, next) => {
    u.login(req.body.email, req.body.password).then(user => {
      let _user = _.assign(resUser(user), token.create(user));
      res.json(_user);
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  router.put('/api/v1/users', (req, res, next) => {
    u.update(req.user.email, req.body.password).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  router.get('/api/v1/users', (req, res, next) => {
    u.findOneByEmail(req.user.email).then(user => {
      res.json(resUser(user));
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  // router.get('/api/v1/users/:userId', (req, res, next) => {
  //   u.findOneById(req.req.params.userId).then(user => {
  //     res.json(resUser(user));
  //   }).catch(err => {next(new Error(err));});});

  router.post('/api/v1/users/areas', (req, res, next) => {
    area.create(req.user._id, req.body.loc[0], req.body.loc[1], req.body.radius, req.body.name).then(area => {
      res.json(area);
    }).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  router.get('/api/v1/users/areas', (req, res, next) => {
    area.getAllByUserId(req.user._id).then(areas => res.json(areas)).catch(err => {
      //TODO: error handling
      next(new Error(err));
    });});

  // router.get('/api/v1/users/:userId/areas', (req, res, next) => {
  //   area.getAllByUserId(req.query.userId).then(areas => {
  //     res.json(areas);
  //   }).catch(err => {
  //     //TODO: error handling
  //     next(new Error(err));
  //   });});
}
