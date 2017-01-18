const gulp    = require('gulp');
const utils   = require('./utils.js');
const msg     = require('gulp-messenger');
const concat  = require('gulp-concat');
const chalk   = require('chalk');
const uglify  = require('gulp-uglifyjs');
const pkgInfo = require('../package.json');

msg.init({timestamp: true});

const files = [
  './build/datetime-picker.directive.js',
  './src/lib/datepicker.js',
  './src/lib/timepicker.js'
];

gulp.task('build:vendor', () => {
  msg.log(chalk.yellow.bold(`==> WIP ${chalk.cyan.bold(pkgInfo.name)} Vendor Bundle Build In Progress`));
});

gulp.task('build:dev', () => {
  gulp.src(files)
    .pipe(concat('datetime-picker.directive.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/lib'))
    .on('end', () => {
      msg.log(chalk.green.bold(`==> ${chalk.cyan.bold(pkgInfo.name)} Development Built Successfully`));
    });
});

gulp.task('build:prod', () => {
  gulp.src(files)
    .pipe(concat('datetime-picker.directive.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/lib'))
    .on('end', () => {
      msg.log(chalk.green.bold(`==> ${chalk.cyan.bold(pkgInfo.name)} Production Built Successfully`));
    });
});

gulp.task('build', ['build:prod','build:dev']);
