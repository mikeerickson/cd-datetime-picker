var assert = require('assert');
var chalk  = require('chalk');

describe(chalk.cyan.bold(' ==> Application'), function () {
  describe(chalk.yellow.bold(' ==> Section 1'), () => {
    it('should pass', function () {
      assert(true);
    });
  });
});
