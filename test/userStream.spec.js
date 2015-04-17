import { a, expect, UserHelper, ioConnect, createIos, cleanIos } from './helper';
import P from 'bluebird';


describe('UserStream flows', () => {

  it('testPingPong', (done) => {
    let ios = createIos(2);
    let msgs = [];

    let check = function(client){
      client.on('pong', function(msg){
        console.log(msg);
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

  it('public ping', (done) => {
    UserHelper.login().then(res => {
      let token = res.body.token;

      let io1 = ioConnect({
        query: 'token=' + token
      });
      let io2 = ioConnect();
      let msgs = [];

      let check = function(client){
        client.on('userStream:main', function(msg){
          console.log('msg:', msg);
          msgs.push((msg));
          if (msgs.length === 1) {
            io1.disconnect();
            io2.disconnect();
            done();
          };
        });
      };

      P.all([io1.onAsync('connect'), io2.onAsync('connect')]).then(() => {
        console.log('all?;');
        check(io1);
        check(io2);

        a.get('/ping')
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }
          });
      });

    }, err => { done(err); });

  });

});
