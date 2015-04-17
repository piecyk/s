import {authorize} from './../utils/token';
import winston     from 'winston';
import async       from 'async';


const log = function() {
  winston.log('info', 'userStream:', arguments);
};
const Chan = {
  UserStreamMain: 'userStream:main'
};
export let io;
export let sockets = [];

//TODO: maybe not best why, but for now ...
export function setIo(_io) {
  io = _io;
  io.use(authorize());
  io.on('connection', socket => { stream(socket); });
};

function stream(socket) {

  sockets.push(socket);
  log('connected address: ', socket.handshake.address);
  if (socket.handshake.user) {
    log('connected user: ', socket.handshake.user._id);
  }

  socket.on('ping', function (m) {
    socket.emit('pong', m);
  });

  socket.on('disconnect', () => {
    log('disconnected');
    sockets = sockets.filter(s => s !== socket);
  });

};

export function emitToUsers(msg) {
  async.forEach(sockets, function(socket, done) {
    if (socket.handshake.user) {
      socket.emit(Chan.UserStreamMain, msg);
      done();
    } else {
      //socket.emit(Chan.UserStreamMain, msg);
      done();
    }
  });
}
