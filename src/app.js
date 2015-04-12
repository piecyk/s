import express    from 'express';
import http       from 'http';
import bodyParser from 'body-parser';
import {cors}     from './util';
import routes     from './routes';
import morgan     from 'morgan';

import socketio     from 'socket.io';
import {UserStream} from './userStream';
//import socketioJwt  from 'socketio-jwt';

import {errorHandler, NotFoundError} from './errorsUtil';
import expressJwt                    from 'express-jwt';
import {JWT_SECRET}                  from './config';


let app    = express();
let server = http.createServer(app);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.all('/*', cors);
app.all('/api/v1/*', expressJwt({secret: JWT_SECRET}));
app.use('/', routes);
app.all("*", (req, res, next) => next(new NotFoundError("404")));
app.use(errorHandler);


let io = socketio.listen(server);
let sockets = [];

io.on('connection', socket => {
  sockets.push(socket);
  console.log('connected: ', sockets.length);

  socket.on('ping', function (m) {
    socket.emit('pong', m);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    sockets = sockets.filter(s => s !== socket);
  });
});

//TODO: for test;
setInterval(function () {
  let now = Date();
  //console.log(`send time: ${now}`);
  io.sockets.emit('time', now);
}, 5000);


//TODO: add namespace
//let userStream = new UserStream(io);
//https://github.com/auth0/socketio-jwt/issues/27
//io.use(socketioJwt.authorize({secret: JWT_SECRET, handshake: false}));

export default server;
