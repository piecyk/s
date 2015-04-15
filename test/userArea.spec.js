import { expect, a, UserHelper } from './helper';
import * as area from './../src/userArea';
import * as user from './../src/user';
import mongoose  from 'mongoose';
import P         from 'bluebird';

let m = P.promisifyAll(mongoose);

describe.only('UserArea flows', () => {

  it('test', (done) => {
    user.create('sss@wp', 'ss').then(function(u) {
      P.all([area.create(u._id, 1, 1, 2), area.create(u._id, 2, 3, 5)]).then(
        () => { area.UserAreaModel.findAsync({user: u._id}).then((areas) => {
          expect(areas).to.have.length(2);
        }).then(done);});});});

});
