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

//TODO: wiem wiem, senior plakal jak commitowal
userSchema.pre('save', function (next) {
  let self = this;

  mongoose.models.User.findOne({email: self.email},function(err, user) {
    if (err) {
      return next(err);
    } else if (user) {
      user.invalidate("email","email must be unique");
      return next(new Error("email must be unique"));
    } else {
      if (self.isModified('password') || self.isNew) {
        bcryptjs.genSalt(10, function (err, salt) {
          if (err) {
            return next(err);
          }
          bcryptjs.hash(self.password, salt, function (err, hash) {
            if (err) {
              return next(err);
            }
            self.password = hash;
            return next();
          });
        });
      } else {
        return next();
      }
    }
  });

});

userSchema.methods.comparePassword = function (passw, cb) {
  bcryptjs.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};


export const User = mongoose.models.User ?
  mongoose.model('User') : mongoose.model('User', userSchema);

export let create = (email, password) => {
  let deferred = Q.defer();
  let user = new User({email: email, password: password});

  user.save((err, result) => {
    if (err) {
      return deferred.reject(err);
    };
    return deferred.resolve(user.toObject());
  });

  return deferred.promise;
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
