const gulp       = require('gulp');
const msg        = require('gulp-messenger');
const requireDir = require('require-dir');

msg.init({logToFile: true, timestamp: true});

msg.info('Starting: ' + new Date());

// PRELOAD ALL TASKS
// =============================================================================
// you can execute task like `gulp <taskName>`
// - don't load recursively (omit `_disabled` tasks)

requireDir('./tasks', {recurse: false});

gulp.task('default', () => {
  msg.note('*** Gulp Heartbeat ***');
});
