import request        from 'supertest';
import server         from './../src/app';
import mongoose       from 'mongoose';
import async          from 'async';
import _              from 'lodash';
import Q              from 'q';
import chai           from 'chai';
import socketIoClient from 'socket.io-client';


let db_uri = 'mongodb://localhost/db_test';

export let dropCollections = function(callback, toDropColl) {
  var collections = toDropColl || _.keys(mongoose.connection.collections);
  async.forEach(collections, function(collectionName, done) {
    var collection = mongoose.connection.collections[collectionName];
    collection.drop(function(err) {
      (err && err.message != 'ns not found') ? done(err) : done(null);
    });
  }, callback);
};

before(function(done) {
  //mongoose.connection.close();
  if (mongoose.connection.db) {
    console.log('we are here?');
    return done();
  }

  mongoose.connect(db_uri, () => {
    dropCollections(function() {
      console.log('droped Collections');
      done();
    });
  });
});

// chai
export let expect = chai.expect;

// agent
server.listen(59177);
export let a = request.agent(server);

// io
//TODO: fix url
//TODO: wrap it, to use helper object
//let socketURL = 'https://glacial-bastion-4043.herokuapp.com/';
let socketURL = 'http://0.0.0.0:59177';
let options ={
  transports: ['websocket'],
  'force new connection': true
};
export let ioConnect = function() {
  return socketIoClient.connect(socketURL, options);
};
export function createIos(howMany) {
  return _.map(new Array(howMany), () => ioConnect());
}
export let cleanIos = (ios) => {
  _.each(ios, (io) => io.disconnect());
};


// user
export let UserHelper = (function() {
  const defaultUser = {
    "email":"test@wp.pl", "password":"test"
  };

  function userA(method, uri, params, code) {
    let deferred = Q.defer();

    a[method](uri).send(params).expect(code).end(function(err, res) {
      if (err) { return deferred.reject(err); }
      return deferred.resolve(res);
    });

    return deferred.promise;
  }

  function getToken(user) {
    return userA('post', '/login', user || defaultUser, 200).then(
      (res) => { return res.body.token; },
      (err) => { return userA('post', '/register', defaultUser, 200).then(
        (res) => {
          return res.body.token;
        }
      );}
    );
  }

  return {
    model: mongoose.models.User,
    register: function(params, code) {
      return userA('post', '/register',
                   params || defaultUser,
                   code || 200);
    },
    login: function(params, code) {
      return userA('post', '/login',
                   params || defaultUser,
                   code || 200);


    },
    api: function(method, uri, params, code, headers, user) {
      return getToken(user).then(
        (token) => {
          let deferred = Q.defer();
          let _headers = { 'Authorization': `Bearer ${token}` };

          a[method](uri).set(_.extend(_headers, headers))
            .send(params)
            .expect(code || 200).end(function(err, res) {
              if (err) {
                console.log(err);
                return deferred.reject(err);
              }
              return deferred.resolve(res.body);
            });

          return deferred.promise;
        });
    }
  };
})();
