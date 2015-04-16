//import socketio from 'socket.io';

export let io;
export let sockets = [];

//TODO: maybe not best why, but for now ...
export function setIo(_io) {
  io = _io;
  io.on('connection', socket => { stream(socket); });
};

function stream(socket) {

  //TODO: add auth, secure with token get user id,
  // the { userId : _id, socket: socket }

  sockets.push(socket);
  console.log('connected: ', socket.handshake.address);

  socket.on('ping', function (m) {
    socket.emit('pong', m);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    sockets = sockets.filter(s => s !== socket);
  });

};

export function emitToUsers(msg) {
  io.sockets.emit('userStream:main', msg);
}
