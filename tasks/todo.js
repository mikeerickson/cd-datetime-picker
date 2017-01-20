var gulp  = require('gulp');
var todo  = require('gulp-todo');
var msg   = require('gulp-messenger');
var chalk = require('chalk');
var utils = require('./utils.js');

var files = [
  './src/**/*.js',
  './tasks/**/*.js',
  './test/**/*.js',
  './specs/**/*.js',
  '!./src/lib/*',
];

gulp.task('todo', () => {
  gulp.src(files)
    .pipe(todo())
    .pipe(gulp.dest('./'))
    .on('end', function () {
      msg.log(chalk.green.bold(`==> ${chalk.cyan.bold('./TODO.md')} Created Successfully`));
    });
});
