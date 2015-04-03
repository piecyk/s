var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodemon = require('nodemon');
var config = require('./webpack.config.js');

function onBuild(done) {
  return function(err, stats) {
    gutil.log("[webpack]", stats.toString());
    done();
  };
}

gulp.task('backend-build', function(done) {
  webpack(config).run(onBuild(done));
});

gulp.task('backend-watch', function(done) {
  var isDone = false;
  webpack(config).watch(100, function(err, stats) {
    if (!isDone) {
      isDone = true;
      done();
    }
    gutil.log("[webpack]", stats.toString());
    nodemon.restart();
  });
});

gulp.task('build', ['backend-build']);
gulp.task('watch', ['backend-watch']);

gulp.task('run', ['backend-watch'], function() {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'build/bundle'),
    ignore: ['*'],
    watch: ['nooop/'],
    ext: 'noop'
  }).on('restart', function() {
    gutil.log("[nodemon] restart");
  });

});
