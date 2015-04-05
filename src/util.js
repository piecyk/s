export let cors = function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,X-Requested-With,Authorization');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
};

export let tokenize = function(string) {
  let tokens = {};
  string.split('&').forEach(function(pair) {
    var segments = pair.split('=', 2).map(decodeURIComponent);
    if(segments[0]) {// Key must be non-empty.
      tokens[segments[0]] = segments[1];
    }
  });
  return tokens;
};
