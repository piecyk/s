import mongoose from 'mongoose';
import _        from 'lodash';
import P        from 'bluebird';
import util     from 'util';
import winston  from 'winston';

import * as gutil from './geoUtil';


const log = function(msg) {winston.log('info', 'geoModel:', arguments);};
const m = P.promisifyAll(mongoose);

export let BaseGeoSchema = function() {
  m.Schema.apply(this, arguments);

  this.add({
    // Location in WGS84 compliant form
    loc: {type: [Number], index: '2dsphere', required: true, validate: [gutil.isWGS84, 'Invalid WGS84 data']},
    created: {type: Date, default: Date.now},
    updated: {type: Date},
    user: {type: m.Schema.Types.ObjectId, index: true, required: false, ref: 'User'}
  });
};
util.inherits(BaseGeoSchema, m.Schema);
export let GeoSchema = new BaseGeoSchema();
export let GeoModel = m.model('GeoModel', GeoSchema);
