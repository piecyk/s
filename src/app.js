import express    from 'express';
import http       from 'http';
import bodyParser from 'body-parser';
import { cors }   from './util';
import routes     from './routes';
import morgan     from 'morgan';

import {errorHandler, NotFoundError} from './errorsUtil';
import expressJwt                    from 'express-jwt';
import { JWT_SECRET }                from './config';


let app    = express();
let server = http.createServer(app);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.all('/*', cors);
app.all('/api/v1/*', expressJwt({secret: JWT_SECRET}));
app.use('/', routes);
app.all("*", (req, res, next) => next(new NotFoundError("404")));
app.use(errorHandler);


export default server;
