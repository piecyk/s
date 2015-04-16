import mongoose from 'mongoose';
import _        from 'lodash';
import P        from 'bluebird';
import util     from 'util';
import winston  from 'winston';

const l = function(msg) {winston.log('info', 'geoModel:', msg);};
const m = P.promisifyAll(mongoose);

export let BaseGeoSchema = function() {
  m.Schema.apply(this, arguments);

  this.add({
    // Location in WGS84 compliant form
    loc: {
      type: [Number], index: '2dsphere', required: true
    },
    created: {
      type: Date, default: Date.now
    },
    user: {
      type: m.Schema.Types.ObjectId, index: true, required: false, ref: 'User'
    }
  });
};
util.inherits(BaseGeoSchema, m.Schema);

export const GeoSchema = new BaseGeoSchema();
export const GeoModel = m.models.GeoModel ? m.model('GeoModel') : m.model('GeoModel', GeoSchema);
