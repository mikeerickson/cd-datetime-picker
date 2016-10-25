
var notify = require('gulp-notify');
var config = require('../gulp.config');
var msg    = require('gulp-messenger');

module.exports = function () {

  let showErrors = config.defaults.show || false;
  let args       = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  if (showErrors) {
    notify.onError({
      title:   'Compile Error',
      message: '<%= error %>'
    }).apply(this, args);
  }
  else {
    msg.error('An error occurred during task processing');
  }

  // Keep gulp from hanging on this task
  this.emit('end');
};
