import mongoose from 'mongoose';
import _        from 'lodash';
import P        from 'bluebird';
import util     from 'util';
import winston  from 'winston';

import {BaseGeoSchema, GeoSchema, GeoModel} from './../geo/geoModel';

const l = function(msg) {winston.log('info', 'userArea:', msg);};
const m = P.promisifyAll(mongoose);

export const UserAreaSchema = new BaseGeoSchema({
  radius: {
    type: Number, min: 1, max: 20, required: true
  }
});
export const UserAreaModel = m.models.UserAreaModel ? m.model('UserAreaModel') : GeoModel.discriminator('UserAreaModel', GeoSchema);


export let create = (_id, lng, lat, radius) => {
  l('create user area');
  let params = {user: _id, loc: [lng, lat], radius: radius};
  return (new UserAreaModel(params)).saveAsync().then(function(area) {
    return area[0];
  });
};
