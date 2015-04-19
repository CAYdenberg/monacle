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
gulp.task('build', ['js', 'css', 'vendor-js', 'vendor-css']);

gulp.task('default', ['js', 'css']);