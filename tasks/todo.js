var gulp  = require('gulp');
var todo  = require('gulp-todo');
var msg   = require('gulp-messenger');
var chalk = require('chalk');
var utils = require('./utils.js');

var files = [
  './src/**/*.js',
  '!./src/lib/*'

];

gulp.task('todo', () => {
  gulp.src(files)
    .pipe(todo())
    .pipe(gulp.dest('./'))
    .on('end', function () {
      msg.log(chalk.green('==> `./TODO.md` Created'));
    });
});
