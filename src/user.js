import mongoose from 'mongoose';
import crypto   from 'crypto';
import uuid     from 'node-uuid';
import _        from 'lodash';

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashed_password: String,
  salt: {
    type: String,
    required: true,
    default: uuid.v1
  },
  created: {
    type: Date,
    default: Date.now
  }
});

userSchema.virtual('password')
  .set(function (password) {
    this.hashed_password = this.encryptPassword(password);
  });

userSchema.method('authenticate', function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
});

userSchema.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

export let User = mongoose.model('User', userSchema);

//TODO: re-factor to use promise add jwt,
export let create = (email, password, res) => {
  let user = new User({email: email, password: password});
  user.save((err, result) => {
    if (err) {
      return res.json(err);
    };
    return res.json(user.toObject());
  });
};

export let login = (email, password, res) => {
  User.findOne({email: email}, function(err, user) {
    if (user && user.authenticate(password)) {
      return res.json(user.toObject());
    } else {
      return res.json("wrong password");
    }
  });
};
