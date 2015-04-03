import express    from 'express';
import http       from 'http';
//import socketio   from 'socket.io';
//import _          from 'lodash';
//import jwt        from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { cors }   from './util';
import routes     from './routes';

let app    = express();
let server = http.createServer(app);

app.use(bodyParser.json());
app.all('/*', cors);
//app.all('/api/v1/*', [validateRequest]);
app.use('/', routes);

// If no route is matched by now, it must be a 404
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

export default server;
