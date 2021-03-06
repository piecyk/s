import { expect, a, UserHelper } from './helper';

describe('User flows', () => {

  it('test', (done) => {
    a.get('/ping')
      .expect(200)
      .end(function(err, res) {
        if (err) { throw err; }
        done();
      });
  });

  it('find user', (done) => {
    UserHelper.model.find({}, function(err, users) {
      expect(users).to.have.length(0);
      done();
    });
  });

  it('register user', (done) => {
    UserHelper.register().then(
      (res) => {
        expect(res.body).to.have.property('token');
        done();
      },
      (err) => {done(err);}
    );
  });

  it('register the same user again, check 500', (done) => {
    UserHelper.register(null, 500).then(
      (res) => { done(); },
      (err) => { done(err); }
    );
  });

  it('register user and update password', (done) => {
    var user = {email: 's@wp.pl', password: 'ss'};
    var user2 = {email: 's@wp.pl', password: 'ss123'};
    UserHelper.register(user).then(
      (res) => {
        expect(res.body).to.have.property('token');

        UserHelper.api('put', '/api/v1/users', user2, null, null, user).then(
          (res) => {
            UserHelper.login(user2).then(() => done());
          },
          (err) => { console.log(err); done();});

      },
      (err) => {
        console.log(err);
        done();
      }
    );
  });

  it('login user to get the token', (done) => {
    UserHelper.login().then(res => {
      expect(res.body).to.have.property('token');
      done();
    }, err => { done(err); });
  });

  it('find user after register', (done) => {
    UserHelper.model.find({}, function(err, users) {
      expect(users).to.have.length(2);
      done();
    });
  });

  function getToken() {
    return UserHelper.login().then(
      (res) => {return res.body.token; });
  }

  it('test very secure ping endpoint', (done) => {
    getToken().then(
      token => {
        var headers = { 'Authorization': `Bearer ${token}` };
        a.get('/api/v1/ping').set(headers).expect(200).end(function(err, res) {
          expect(res.body).to.have.property('_id');
          done();
        });
      },
      err => {
        done(err);
      }
    );
  });

  // when running one test use it.only('test very...
  it('test very secure ping endpoint using helper', (done) => {
    return UserHelper.api('get', '/api/v1/ping')
      .then(body => {
        expect(body).to.have.property('_id');
        done();
      }, err => done(err));
  });

  // when running one test use it.only('test very...
  it('get user details', (done) => {
    return UserHelper.api('get', '/api/v1/users')
      .then(body => {
        console.log(body);
        expect(body).to.have.property('_id');
        done();
      }, err => done(err));
  });

});
