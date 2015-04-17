import _ from 'lodash';

export let isWGS84 = (data) => {
  console.log('Checking' + JSON.stringify(data));
  return _.size(data) == 2 && data[0] && data[1] &&
    (data[0] >= -180) && (data[0] <= 180) &&
    (data[1] >= -90)  && (data[1] <= 90);
};
