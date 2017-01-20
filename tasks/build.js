const gulp    = require('gulp');
const utils   = require('./utils.js');
const msg     = require('gulp-messenger');
const concat  = require('gulp-concat');
const chalk   = require('chalk');
const uglify  = require('gulp-uglifyjs');
const pkgInfo = require('../package.json');
const shell   = require('gulp-shell');

msg.init({timestamp: true});

// TODO: Do something fancy

const srcFiles = [
  './build/datetime-picker.directive.js',
  './src/lib/datepicker.js',
  './src/lib/timepicker.js'
];

const vendorFiles = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/bootstrap/dist/bootstrap.min.js',
  './node_modules/moment/min/moment.min.js',
  './node_modules/angular/angular.min.js',
];

// build:vendor always invoked manually as it rarely changes
gulp.task('build:vendor', () => {
  return gulp.src(vendorFiles)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./demo/js'))
    .pipe(msg.flush.log(chalk.bold.green(`==> ${chalk.cyan.bold(pkgInfo.name)} Vendor Bundle Built Successfully`)));
});

gulp.task('build:dev', () => {
  gulp.src(srcFiles)
    .pipe(concat('datetime-picker.directive.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/lib'))
    .pipe(shell(['bump prerelease']))
    .on('end', () => {
      msg.log(chalk.green.bold(`==> ${chalk.cyan.bold(pkgInfo.name)} Development Bundle Built Successfully`));
    });
});

gulp.task('build:prod', () => {
  gulp.src(srcFiles)
    .pipe(concat('datetime-picker.directive.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/lib'))
    // .pipe(shell(['bump prerelease']))  // dont bump production version, handled by `np`
    .on('end', () => {
      msg.log(chalk.green.bold(`==> ${chalk.cyan.bold(pkgInfo.name)} Production Bundle Built Successfully`));
    });
});

gulp.task('build', ['build:prod','build:dev']);
