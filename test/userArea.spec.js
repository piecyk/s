import { expect, a, UserHelper } from './helper';
import * as area from './../src/user/userArea';
import * as user from './../src/user/user';
import mongoose  from 'mongoose';
import P         from 'bluebird';

const loc = {
  rze: [50.04119, 21.99912]
};

describe('UserArea flows', () => {

  it('test', (done) => {
    user.create('sss@wp.pl', 'ss').then((_user) => {
      P.all([area.create(_user._id, loc.rze[0], loc.rze[1], 2), area.create(_user._id, loc.rze[0], loc.rze[1], 5)]).then(() => {
        area.UserAreaModel.findAsync({user: _user._id}).then((areas) => {
          expect(areas).to.have.length(2);
        }).then(done);});});});

  it('create user area for user', (done) => {
    var params = {loc: loc.rze, radius: 5};
    return UserHelper.api('post', '/api/v1/users/areas', params)
      .then(body => {
        console.log(body);
        expect(body).to.have.property('_id');
        done();
      }, err => done(err));});

  it('create two areas, and get them', (done) => {
    var user = {email: 'damian@wp.pl', password: 'damian'};
    var params1 = {loc: loc.rze, radius: 5, name: "Moja dzielnia"};
    var params2 = {loc: loc.rze, radius: 2};
    UserHelper.register(user).then(
      (res) => {
        P.all([
          UserHelper.api('post', '/api/v1/users/areas', params1, null, null, user),
          UserHelper.api('post', '/api/v1/users/areas', params2, null, null, user)
        ]).then(() => {
          UserHelper.api('get', '/api/v1/users/areas', null, null, null, user).then(function(areas) {
            console.log(areas);
            expect(areas).to.have.length(2);
            done();
          });});});});

});
