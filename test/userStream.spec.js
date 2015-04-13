import { a, expect, UserHelper, ioConnect, createIos, cleanIos } from './helper';
// import Q                                 from 'q';

describe('UserStream flows', () => {

  it('testPingPong', (done) => {
    let ios = createIos(2);
    let msgs = [];

    let check = function(client){
      client.on('pong', function(msg){
        msgs.push((msg));
        if (msgs.length === 2){
          cleanIos(ios);
          done();
        };
      });
    };

    ios[0].on('connect', function(data){
      check(ios[0]);
      ios[0].emit('ping', 'ping?> from io1');
    });

    ios[1].on('connect', function(data){
      check(ios[1]);
      ios[1].emit('ping', 'ping?> from io2');
    });

  });

  it('emit to all users', (done) => {
    let ios = createIos(2);
    let msgs = [];

    let check = function(client){
      client.on('userStream:main', function(msg){
        msgs.push((msg));
        if (msgs.length === 6) {
          cleanIos(ios);
          done();
        };
      });
    };

    ios[0].on('connect', () => check(ios[0]));
    ios[1].on('connect', () => check(ios[1]));

    // register new user
    UserHelper.register();
    UserHelper.register();
    UserHelper.register();
  });

  it('public ping', (done) => {
    let ios = createIos(2);
    let msgs = [];

    let check = function(client){
      client.on('userStream:main', function(msg){
        console.log('msg:', msg);
        msgs.push((msg));
        if (msgs.length === 2) {
          cleanIos(ios);
          done();
        };
      });
    };

    ios[0].on('connect', () => check(ios[0]));
    ios[1].on('connect', () => check(ios[1]));

    // register new user
    a.get('/ping').expect(200).end();
  });

});
