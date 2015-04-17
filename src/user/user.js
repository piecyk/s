import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import _        from 'lodash';
import P        from 'bluebird';
import winston  from 'winston';

const l = function(msg) {winston.log('info', msg);};
const m = P.promisifyAll(mongoose);
const b = P.promisifyAll(bcryptjs);
const SALT_WORK_FACTOR = 10;

function validateLocalProvider(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
}
export let UserSchema = new mongoose.Schema({
  email: {
    type: String, trim: true, unique: true, required: true, lowercase: true,
    validate: [validateLocalProvider, 'Please fill in your email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  name: {
    type: String, trim: true,
    validate: [validateLocalProvider, 'Please fill in your name']
  },
  password: {type: String, required: true},
  salt: {type: String},
  provider: { type: String, required: 'Provider is required'},
  updated: {type: Date},
  created: {type: Date, default: Date.now}
});

UserSchema.path('email').validate(function(value, respond) {
  var self = this;
  this.constructor.findOneAsync({email: value}).then(user => {
    return user ? respond(self.id === user.id) : respond(true);
  });
}, 'The specified email address is already in use.');

UserSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) { return next(); }

  // password changed so we need to hash it (generate a salt)
  return b.genSaltAsync(SALT_WORK_FACTOR).then((salt)=> {
    user.salt = salt; //TODO: is it good idea to store salt? NOOOO :P
    return b.hashAsync(user.password, salt).then((hash) => {
      user.password = hash;
      next();
    });});});

UserSchema.methods.comparePassword = function(password) {
  var self = this;
  return P.try(() => {
    if (_.isEmpty(password)) { throw new Error("password is null"); }
    return b.compareAsync(password, self.password);
  });
};
export let UserModel = m.model('User', UserSchema);


export let findOneByEmail = (email) => {
  return UserModel.findOneAsync({email: email});
};

export let findOneById = (id) => {
  return UserModel.findOneAsync({_id: id});
};

export let create = (email, password, provider) => {
  var parms = {
    email: email, password: password, provider: 'local'
  };
  return (new UserModel(parms)).saveAsync().then(function(user) {
    return user[0];
  });
};

export let update = (email, password) => {
  var params = { password: password, updated: Date.now(), provider: 'local' };
  return findOneByEmail(email).then((user) => {
    if (_.isEmpty(user)) { throw new Error("we don't have this user, buuu"); }
    return _.assign(user, params).saveAsync().then(function(user) {
      return user[0];
    });
  });
};

export let login = (email, password) => {
  return findOneByEmail(email).then((user) => {
    if (_.isEmpty(user)) { throw new Error("we don't have this user, buuu"); }
    return user.comparePassword(password).then((isMatch) => {
      if (isMatch) { return user; }
      else { throw new Error("Password is not correct"); }
    });
  });
};
