var gulp   = require('gulp');
var utils  = require('./utils.js');
var msg    = require('gulp-messenger');
var concat = require('gulp-concat');

var files = [
  './build/datetime-picker.directive.js',
  './src/lib/datepicker.js',
  './src/lib/timepicker.js'
];

gulp.task('build', function () {
  gulp.src(files)
    .pipe(concat('datetime-picker.directive.min.js'))
    .pipe(gulp.dest('./build'))
    .on('end', function () {
      msg.success('==> Build Successful');
    })
    .pipe(utils.pass('==> Build Successful'));
});
