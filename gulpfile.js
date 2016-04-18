'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var less = require('gulp-less-sourcemap');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var config = require('./config.js');

//load dev dependencies
if (config.env === 'development') {
  var browserSync = require('browser-sync');
  var nodemon = require('gulp-nodemon');
  var eslint = require('gulp-eslint');
  var mocha = require('gulp-mocha');
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* BUILD VENDOR FILES AND SEND TO DIST FOLDER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('lens-css', function() {
  var file = './node_modules/lens-starter/lens.css';
  return gulp.src(file)
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('lens-js', function() {
  var files = ['./node_modules/lens-starter/lens.js'];
  return gulp.src(files)
    .pipe(concat('lens.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('lens', ['lens-css', 'lens-js']);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* PRINCIPLE BUILD TASKS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('lint', function() {
  if (config.env === 'development') {
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
})

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify('./src/script.js')
    .transform("babelify", {presets: ['es2015', 'react']});

  if (config.env === 'development') {
    return b.bundle()
      .pipe(source('script.js'))
      .pipe(buffer())
      .on('error', gutil.log)
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream());
  } else {
    return b.bundle()
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe(uglify().on('error', gutil.log))
      .pipe(gulp.dest('./dist/js'));
  }
});

gulp.task('css', function() {
  if (config.env === 'development') {
    return gulp.src('./src/main.less')
      .pipe(rename('style'))
      .pipe(rename({extname : '.css'}))
      .pipe(less())
      .on('error', gutil.log)
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream());
  } else {
    return gulp.src('./src/main.less')
      .pipe(rename('style'))
      .pipe(rename({extname : '.css'}))
      .pipe(less())
      .on('error', gutil.log)
      .pipe(minifyCSS())
      .pipe(gulp.dest('./dist/css'));
  }
});

//do everything
gulp.task('build', ['lint', 'js', 'css', 'lens-js']);

//default. Just the primary (non-vendor) CSS and JS
gulp.task('default', ['lint', 'js', 'css']);


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
    watch: ['routes/**/*.js', 'db/**/*.js']
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

  gulp.watch(['src/**/*.js', 'components/**/*.js', 'stores/**/*.js', 'lib/**/*.js'], ['js']);
  gulp.watch(['src/**/*.less'], ['css']);
  gulp.watch(['views/**/*.hbs']).on('change', browserSync.reload);
});


/*~~~~~~~~~~~~~~~~~~~~~~~~
* TESTS
~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('test', function() {
	return gulp.src(['test/*.js'], { read: false })
		.pipe(mocha({ reporter: 'list' }))
		.on('error', gutil.log);
});

gulp.task('test-watch', function() {
	gulp.watch(['**/*.js'], ['test']);
});
