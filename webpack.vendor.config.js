/*global __dirname*/

const webpack = require('webpack');
const path    = require('path');
const chalk   = require('chalk');

const WebpackShellPlugin = require('@slightlytyler/webpack-shell-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

let webpackConfig = {
  context: __dirname + '/src',
  entry: [
    './vendor/jquery.min.js',
    './vendor/bootstrap.min.js',
    './vendor/angular.min.js',
    './vendor/moment.min.js',
  ],
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'vendor.min.js'
  },
  module: {
    rules: [
      {test: /\.js?$/, loaders: ['babel-loader'], exclude: /node_modules/},
    ]
  },
  plugins: [
    new WebpackShellPlugin({onBuildEnd: ['gulp build:vendor']}),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new ProgressBarPlugin({
      format: chalk.yellow.bold('Building Vendor [:bar] ') + chalk.green.bold(':percent') + chalk.bold(' (:elapsed seconds)'),
      clear: true,
      summary: true
    }),
  ]
};

module.exports = webpackConfig;
