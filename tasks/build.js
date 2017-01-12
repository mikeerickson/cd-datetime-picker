var gulp    = require('gulp');
var utils   = require('./utils.js');
var msg     = require('gulp-messenger');
var concat  = require('gulp-concat');
var chalk   = require('chalk');
var uglify  = require('gulp-uglifyjs');
var pkgInfo = require('../package.json');

msg.init({timestamp: true});

var files = [
  './build/datetime-picker.directive.js',
  './src/lib/datepicker.js',
  './src/lib/timepicker.js'
];

gulp.task('build:vendor', () => {
  msg.log(chalk.yellow.bold(`==> WIP ${pkgInfo.name} Vendor Bundle Build In Progress`));
});

gulp.task('build:dev', function () {
  gulp.src(files)
    .pipe(concat('datetime-picker.directive.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/lib'))
    .on('end', function () {
      msg.log(chalk.green.bold(`==> ${pkgInfo.name} Development Built Successfully`));
    });
});

gulp.task('build:prod', function () {
  gulp.src(files)
    .pipe(concat('datetime-picker.directive.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/lib'))
    .on('end', function () {
      msg.log(chalk.green.bold(`==> ${pkgInfo.name} Production Built Successfully`));
    });
});

gulp.task('build', ['build:dev','build:prod']);
