'use strict';

require('dotenv').config();

var gulp = require('gulp');
var gutil = require('gulp-util');

//dev-dependencies
if (process.env.ENV === 'development') {
  var browserSync = require('browser-sync');
  var nodemon = require('gulp-nodemon');
  var eslint = require('gulp-eslint');
  var mocha = require('gulp-mocha');
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* PRINCIPLE BUILD TASKS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('lint', function() {
  if (process.env.env === 'development') {
    return gulp.src(['**/*.js','!node_modules/**', '!dist/**'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format());
  } else {
    return true;
  }
});

gulp.task('js', function () {
  return true
});

gulp.task('css', function() {
  return true
});


/*~~~~~~~~~~~~~~~~~~~~~~~~
* WATCH, START THE APP, AND LIVE RELOAD
~~~~~~~~~~~~~~~~~~~~~~~ */

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {

  return nodemon({
    // nodemon our expressjs server
    script: 'bin/www',
    // watch core server file(s) that require server restart on change
    watch: ['routes/**.js']
  })
  .once('start', cb)
  .on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false   //
      });
    }, BROWSER_SYNC_RELOAD_DELAY);
  });

});

gulp.task('watch', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:' + config.port,

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000

  });

  gulp.watch(['src/**/*.js', 'lib/**/*.js'], ['js']);
  gulp.watch(['src/**/*.less'], ['css']);
  gulp.watch(['views/**/*.hbs']).on('change', browserSync.reload);
});


/*~~~~~~~~~~~~~~~~~~~~~~~~
* TESTS
~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('test', function() {
	return gulp.src(['test/*.js'], { read: false })
		.pipe(mocha({reporter: 'list'}))
		.on('error', gutil.log);
});

gulp.task('test-watch', function() {
	gulp.watch(['**/*.js'], ['test']);
});
