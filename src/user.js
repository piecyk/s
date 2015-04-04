import mongoose from 'mongoose';
//import crypto   from 'crypto';
//import uuid     from 'node-uuid';
import bcryptjs from 'bcryptjs';
import _        from 'lodash';
import Q        from 'q';

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function (next) {
  let user = this;
  if (this.isModified('password') || this.isNew) {
    bcryptjs.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcryptjs.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (passw, cb) {
  bcryptjs.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

export let User = mongoose.model('User', userSchema);

//TODO: re-factor to use promise add jwt,
export let create = (email, password, res) => {
  let user = new User({email: email, password: password});
  user.save((err, result) => {
    if (err) {
      return res.status(401).json(err);
    };
    return res.json(user.toObject());
  });
};

export let login = (email, password) => {
  let deferred = Q.defer();

  User.findOne({email: email}, function(err, user) {
    if (err || _.isNull(user)) {
      return deferred.reject(err);
    }
    user.comparePassword(password, function (err, isMatch) {
      if (isMatch && !err) {
        return deferred.resolve(user);
      } else {
        return deferred.reject(err);
      }
    });
  });

  return deferred.promise;
};
