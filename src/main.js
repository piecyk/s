import server                      from './app';
import { HTTP_PORT, MONGOLAB_URI } from './config';
import mongoose                    from 'mongoose';

mongoose.connect(MONGOLAB_URI, (err, res) => {
  if (err) {
    console.log(`Mongo error on uri ${MONGOLAB_URI}`);
    console.log(err);
  } else {
    console.log(`Mongo connected on uri ${MONGOLAB_URI}`);
  }
});

server.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}...`));
