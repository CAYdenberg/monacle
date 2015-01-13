var gulp = require('gulp');
var browserify = require('gulp-browserify');

// Basic usage
gulp.task('lens', function() {
    // Single entry point to browserify
    gulp.src('bin/lens/lens.js')
        .pipe(browserify({
          insertGlobals : true,
        }))
        .pipe(gulp.dest('./public/js/'))
});