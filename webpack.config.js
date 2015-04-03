var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: "./src/main.js",
  target: 'node',
  //devtool: '#eval-source-map',
  debug: true,
  output: {
    path: path.join(__dirname, 'build'),
    filename: "bundle.js"
  },
  node: {
    __dirname: true,
    __filename: true
  },
  externals: nodeModules,
  recordsPath: path.join(__dirname, 'build/_records'),
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  }
};
