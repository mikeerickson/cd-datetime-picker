var gulp   = require('gulp');
var utils  = require('./utils.js');
var msg    = require('gulp-messenger');
var concat = require('gulp-concat');
var chalk  = require('chalk');

msg.init({timestamp: true});

var files = [
  './dist/datetime-picker.directive.js',
  './src/lib/datepicker.js',
  './src/lib/timepicker.js'
];

gulp.task('build', function () {
  gulp.src(files)
    .pipe(concat('datetime-picker.directive.min.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/lib'))
    .on('end', function () {
      msg.log(chalk.green.bold('==> Build Completed Successfully'));
    })
    .pipe(utils.pass('==> Build Successful'));
});
