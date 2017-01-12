/*global __dirname*/

const webpack            = require('webpack');
const path               = require('path');
const WebpackShellPlugin = require('@slightlytyler/webpack-shell-plugin');

let webpackConfig = {
  context: __dirname + '/src',
  entry: {
    app: './vendor.js'
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'vendor.min.js'
  },
  module: {
    loaders: [
      {test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/},
    ]
  },
  devServer: {
    stats: 'errors-only', // hide all those annoying warnings
  },
  plugins: [
    new WebpackShellPlugin({onBuildEnd: ['gulp build:vendor']}),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
  ]
};

module.exports = webpackConfig;
