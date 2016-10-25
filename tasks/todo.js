/**
 * todo.js
 * Created: 5/20/2016 9:48 AM (merickson)
 * =============================================================================
 */

var gulp = require('gulp');
var config = require('./gulp.config');
var todo = require('gulp-todo');
var exclude = require('gulp-ignore');
var msg = require('gulp-messenger');
var temp = require('cd-utils');
var handleErrors = require('./utils/handleErrors');

let args  = process.argv.slice(3);
let utils = temp({});

let openReport = (args.indexOf('--open') >= 0) || (config.todo.openReport && (utils.isOSX() || utils.isLinux()));

msg.init({logToFile: true, timestamp: true, showPipeFile: false});

gulp.task('todo', () => {
  return gulp.src(config.todo.src)
    .on('error', handleErrors)
    .pipe(exclude(config.todo.exclude))
    .pipe(todo())
    .pipe(gulp.dest('./'))
    .on('end', function (){
      if (openReport) {
        console.log('this is not ready yet');
        // utils.displayMarkdownInTerminal(config.todo.output);
      }
    })
    .pipe(msg.flush.success('*** ' + config.todo.output + ' created @ ' + utils.timestamp() + ' ***'));
});
