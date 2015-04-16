import { expect, a, UserHelper } from './helper';
import * as area from './../src/user/userArea';
import * as user from './../src/user/user';
import mongoose  from 'mongoose';
import P         from 'bluebird';

describe('UserArea flows', () => {

  it('test', (done) => {
    user.create('sss@wp.pl', 'ss').then((_user) => {
      P.all([area.create(_user._id, 1, 2, 2), area.create(_user._id, 2, 3, 5)]).then(() => {
        area.UserAreaModel.findAsync({user: _user._id}).then((areas) => {
          expect(areas).to.have.length(2);
        }).then(done);});});});

  it('create user area for user', (done) => {
    var params = {loc: [1,2], radius: 5};
    return UserHelper.api('post', '/api/v1/user/area', params)
      .then(body => {
        console.log(body);
        expect(body).to.have.property('_id');
        done();
      }, err => done(err));
  });

});
