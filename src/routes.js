import express                   from 'express';
import _                         from 'lodash';
//import {UnauthorizedAccessError} from './errorsUtil';
//import * as token                from './token';
import {emitToUsers}             from './user/userStream';
import setUserRoutes             from './user/userRoutes';

let router = express.Router();

setUserRoutes(router);

router.get('/api/v1/ping', (req, res) => {
  //console.log(req.user);
  res.json(_.pick(req.user, '_id'));
});

router.get('/ping', (req, res) => {
  emitToUsers({msg: 'someone hit the publick helfcheck, ping'});
  res.json({msg: 'pong'});
});

export default router;
