import mongoose from 'mongoose';
import _        from 'lodash';
import P        from 'bluebird';
import util     from 'util';

let m = P.promisifyAll(mongoose);

function BaseGeoSchema() {
  m.Schema.apply(this, arguments);

  this.add({
    // Location in WGS84 compliant form
    loc: {
      type: [Number], index: '2dsphere', required: true
    },
    created: {
      type: Date, default: Date.now
    }
  });
}
util.inherits(BaseGeoSchema, m.Schema);

export const GeoSchema = new BaseGeoSchema();
export const GeoModel = m.models.GeoModel ? m.model('GeoModel') : m.model('GeoModel', GeoSchema);


export const UserAreaSchema = new BaseGeoSchema({
  radius: {
    type: Number, min: 1, max: 20, required: true
  }
});
export const UserAreaModel = m.models.UserAreaModel ? m.model('UserAreaModel') : GeoModel.discriminator('UserAreaModel', GeoSchema);


export let create = (userId, lng, lat, radius) => {
  let params = { loc: [lng, lat], radius: radius};
  return (new UserAreaModel(params)).saveAsync().catch(err => console.log(err));
};
