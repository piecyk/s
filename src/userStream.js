//import socketio from 'socket.io';

export let io;
export let sockets = [];

//TODO: maybe not best why, but for now ...
export function setIo(_io) {
  io = _io;
  io.on('connection', socket => { stream(socket); });
};

function stream(socket) {

  sockets.push(socket);
  console.log('connected: ', sockets.length);

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
