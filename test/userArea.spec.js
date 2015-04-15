import { expect, a, UserHelper } from './helper';
import { create } from './../src/userArea.js';


describe.only('UserArea flows', () => {

  it('test', (done) => {
    create('1',1,1,2).then(
      (area) => console.log(area)
    ).then(done());
  });


});
