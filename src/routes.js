import express                   from 'express';
import _                         from 'lodash';
import {create, login}           from './user';
import {UnauthorizedAccessError} from './errorsUtil';
import * as token                from './token';


let router = express.Router();

//curl -X POST -H "Content-Type: application/json" -d '{"email":"test@wp.pl","password":"test"}' http://localhost:3000/register
router.post('/register', (req, res, next) => {
  create(req.body.email, req.body.password)
    .then(
      (user) => res.json(token.create(user)),
      (err) => next(new Error(err)));});

//curl -X POST -H "Content-Type: application/json" -d '{"email":"test@wp.pl","password":"test"}' http://localhost:3000/login
router.post('/login', (req, res, next) => {
  const email    = req.body.email;
  const password = req.body.password;
  const error    = new UnauthorizedAccessError("401", {
    message: 'Invalid username or password'
  });

  if (_.isEmpty(email) || _.isEmpty(password)) {return next(error);}

  return login(req.body.email, req.body.password)
    .then(
      (user) => res.json(token.create(user)),
      (err) => next(error));});


router.get('/api/v1/ping', (req, res) => res.json(_.pick(req.user, '_id')));
router.get('/ping', (req, res) => res.json({msg: 'pong'}));


// import passport from 'passport';
// import Strategy from 'passport-twitter';
// import User from './user';

// passport.use(new Strategy({
//   consumerKey: '6zgQ5Qy8RTMTMLBP9uZjPDMwh',
//   consumerSecret: 'UcElD0rMsOUbqjO1AH6nMp0TwcmDvjIZpmcYKrSkojXkzc2rUU',
//   callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
// }, function(token, tokenSecret, profile, done) {
//   //process.nextTick(function () {
//   console.log(profile);
//   return done(null, profile);
//   //});
// }));

// router.get('/auth/twitter',
//            passport.authenticate('twitter'),
//            function(req, res){});

// router.get('/auth/twitter/callback',
//            passport.authenticate('twitter', {
//              failureRedirect: '/login'
//            }),
//            function(req, res) {
//              console.log('res', res);
//              res.send('d');
//            });

export default router;
