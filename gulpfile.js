
var gulp = require('gulp');
var msg = require('gulp-messenger');
var requireDir = require('require-dir');

// PRELOAD ALL TASKS
// =============================================================================
// you can execute task like `gulp <taskName>`
// - don't load recursively (omit `_disabled` tasks)

msg.init({
  logToFile: true,
  timestamp: true
});

msg.info('Starting: ' + new Date());

requireDir('./tasks', {recurse: false});

gulp.task('default', () => {
  msg.note('*** Gulp Heart Beating ***');
});
