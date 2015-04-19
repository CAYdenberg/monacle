'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* BUILD LENS AND SEND TO DIST FOLDER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('lens-js', function() {
	// set up the browserify instance on a task basis
	var b = browserify({
		entries: ['./node_modules/lens-starter/src/app.js'],
		debug: true
	});

	return b.bundle()
		.pipe(source('lens.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		    .pipe(gulp.dest('./dist/js'))
		    .pipe(rename({ extname: '.min.js' }))
		    .pipe(uglify())
		    .on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/js'));
})

gulp.task('lens-css', function() {
	return gulp.src('./node_modules/lens-starter/dist/lens.css')
		.pipe(gulp.dest('./dist/css/'))
		.pipe(rename('lens.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/css/'))
});

gulp.task('lens', ['lens-js', 'lens-css']);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* BUILD VENDOR FILES AND SEND TO DIST FOLDER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('vendor-js', function(){
  return gulp.src('./src/vendor/js/*.js') // read all of the files that are in script/lib with a .js extension
    .pipe(concat('vendor.js')) // concatenate all of the file contents into a file titled 'all.js'
    .pipe(gulp.dest('dist/js')) // write that file to the dist/js directory
    .pipe(rename('vendor.min.js')) // now rename the file in memory to 'all.min.js'
    .pipe(uglify()) // run uglify (for minification) on 'all.min.js'
    .pipe(gulp.dest('./dist/js')); // write all.min.js to the dist/js file
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
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('css', function() {
	return gulp.src('./src/css/style.css')
		.pipe(gulp.dest('./dist/css'))
		.pipe(rename('style.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/css'))
});

//do everything
gulp.task('build', ['js', 'css', 'vendor-js', 'vendor-css', 'lens-js', 'lens-css']);

gulp.task('default', ['js', 'css']);