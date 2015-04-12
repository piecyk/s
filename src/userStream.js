export class UserStream {
  // constructor(io) {
  //   this.sockets = [];

  //   io.on('connection', socket => {
  //     console.log('connected');
  //     this.sockets.push(socket);

  //     socket.on('ping', function (m) {
  //       socket.emit('pong', m);
  //     });

  //     socket.on('disconnect', () => {
  //       this.sockets = this.sockets.filter(s => s !== socket);
  //     });
  //   });

  //   // for testing
  //   setInterval(function () {
  //     let now = Date();
  //     //console.log(`send time: ${now}`);
  //     io.sockets.emit('time', now);
  //   }, 5000);
  // }
};
