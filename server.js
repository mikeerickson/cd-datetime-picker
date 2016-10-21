var express = require('express');
var chalk = require('chalk');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.listen(port, function () {
  let uri = chalk.cyan(`http://localhost:${port}`);
  console.log(`Server Running ${uri} ...`);
});
