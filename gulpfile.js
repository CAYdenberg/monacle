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
//dev-dependencies
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* RUN TESTS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('test', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('test-watch', function() {
    gulp.watch(['lib/**', 'test/**', 'src/**', 'routes/**'], ['test']);
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* BUILD VENDOR FILES AND SEND TO DIST FOLDER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('vendor-js', function(){
	var dir = './src/vendor/js/';
	var files = ['jquery.js', 'bootstrap.js', 'bootstrap-paginator.js', 'jquery-dateFormat.js', 'handlebars-v2.0.0.js'];
	var paths = files.map(function(file) {
		return dir + file;
	});
	return gulp.src(paths)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./dist/js/'))
		.pipe(rename('vendor.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
});

gulp.task('vendor-css', function() {
	return gulp.src('./src/vendor/css/*.css')
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(rename('vendor.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/css'))
});

gulp.task('vendor', ['vendor-js', 'vendor-css']);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* PRINCIPLE BUILD TASKS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: ['./src/js/script.js'],
    debug: true
  });

  return b.bundle()
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
	return gulp.src('./src/less/main.less')
		.pipe(rename('style.css'))
		.pipe(less({
        	sourceMap: {
            	sourceMapRootpath: '../less' // Optional absolute or relative path to your LESS files
        	}
    	}))
    	.on('error', gutil.log)
		.pipe(gulp.dest('./dist/css'))
		.pipe(rename('style.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

//do everything
gulp.task('build', ['js', 'css', 'vendor-js', 'vendor-css']);

//default. Just the primary (non-vendor) CSS and JS
gulp.task('default', ['js', 'css'], function(cb){
  cb();
});


/*~~~~~~~~~~~~~~~~~~~~~~~~
* WATCH, START THE APP, AND LIVE RELOAD
~~~~~~~~~~~~~~~~~~~~~~~ */

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'bin/www',

    // watch core server file(s) that require server restart on change
    watch: ['routes/**']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', ['default'], function onRestart() {
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
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000

  });

  gulp.watch(['src/js/**', 'lib/**'], ['js']);
  gulp.watch(['src/less/**'], ['css']);
  gulp.watch(['views/**']).on('change', browserSync.reload);
});
