var webpack              = require('webpack');
var path                 = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
module.exports = {
  devtool: 'sourcemap',
  context: __dirname + '/src',
  entry: {
    app: './datetime-picker.directive.js'
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'datetime-picker.directive.js'
  },
  module: {
    loaders: [
      {test: /\.js?$/, loaders: ['ng-annotate','babel'], exclude: /node_modules/},
      {test: /\.html?$/, loaders: ['raw']},
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    new WebpackShellPlugin({onBuildEnd:['gulp build']})
  ]
};
