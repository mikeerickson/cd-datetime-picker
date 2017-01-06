var gulp    = require('gulp');
var notify_ = require('gulp-notify');

notify_.logLevel(0);
function _notify(msg) {
  return notify_({message: msg, icon: './tasks/assets/cd-logo.png', title: 'CodeDungeon Starter'});
}

const utils = {
  log: function (msg) {
    return _notify(msg);
  },
  notify: function (msg) {
    return _notify(msg);
  },
  pass: function (msg) {
    return notify_({message: msg, icon: './tasks/assets/green.png', title: 'CodeDungeon Starter'});
  },
  fail: function (msg) {
    return notify_({message: msg, icon: './tasks/assets/red.png', title: 'CodeDungeon Starter'});
  }
};

module.exports = utils;
