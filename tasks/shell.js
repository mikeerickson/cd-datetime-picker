var gulp = require('gulp')
var chalk = require('chalk');

gulp.task('shell', () => {
  gulp.src('./package.json')
    console.log(chalk.green('Success'));
});
