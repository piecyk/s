import express                   from 'express';
import _                         from 'lodash';

import {emitToUsers}             from './user/userStream';
import setUserRoutes             from './user/userRoutes';


let router = express.Router();

setUserRoutes(router);

router.get('/api/v1/ping', (req, res) => {
  res.json(_.pick(req.user, '_id'));
});

router.get('/ping', (req, res) => {
  emitToUsers({msg: 'someone hit the publick helfcheck, ping'});
  res.json({msg: 'pong'});
});

export default router;

// GET /ping - helf check
// POST /register
// POST /login
// GET /api/v1/ping - secure helf check


//TODO: think about the api endpoints and params

// GET /api/v1/users/:userId - get user by userId
// PUT /api/v1/users/ update - user for token user

// GET  /api/v1/users/areas/:areaId - get area for user token
// POST /api/v1/users/areas - creates and area for user token
// PUT  /api/v1/users/areas/:areaId - update and area for user token if he created it

// GET  /api/v1/users/:userId/areas - get all areas for userId
// GET  /api/v1/users/:userId/areas/:areaId - get area for userId
