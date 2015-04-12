import { expect, UserHelper, ioConnect } from './helper';
// import Q                                 from 'q';

describe.only('UserStream flows', () => {

  it('test', (done) => {
    let pongs = [];
    let checkPong = function(client){
      client.on('pong', function(msg){
        pongs.push((msg));
        if (pongs.length === 2){
          done();
        };
      });
    };

    let io1 = ioConnect();
    let io2 = ioConnect();

    io1.on('connect', function(data){
      checkPong(io2);
      io1.emit('ping', 'ping?> from io1');
    });

    io2.on('connect', function(data){
      checkPong(io2);
      io2.emit('ping', 'ping?> from io2');
    });

  });

});
