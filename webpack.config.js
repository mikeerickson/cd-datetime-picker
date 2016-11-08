var webpack = require('webpack');
var path    = require('path');

module.exports = {
  devtool: 'sourcemap',
  context: __dirname + '/src',
  entry: {
    app: './datetime-picker.directive.js'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/},
      {test: /\.html?$/, loaders: ['raw']},
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
}
