import mongoose from 'mongoose';
import _        from 'lodash';
import P        from 'bluebird';
import util     from 'util';
import winston  from 'winston';

import {BaseGeoSchema, GeoModel} from './../geo/geoModel';


const log = function() {winston.log('info', 'userArea:', arguments);};
const m = P.promisifyAll(mongoose);

export let UserAreaSchema = new BaseGeoSchema({
  name: {type: String},
  radius: {type: Number, min: 1, max: 20, required: true}
});

export let UserAreaModel = GeoModel.discriminator('UserAreaModel', UserAreaSchema);


export let create = (_id, lng, lat, radius, name) => {
  log('create user area');
  let params = {user: _id, loc: [lng, lat], radius: radius, name: name || ''};
  return (new UserAreaModel(params)).saveAsync().then(function(area) {
    return area[0];
  });
};

export let getAllByUserId = (_id) => {
  return UserAreaModel.findAsync({user: _id});
};

export let getOneById = (_id) => {
  return UserAreaModel.findOneAsync({_id: _id});
};
