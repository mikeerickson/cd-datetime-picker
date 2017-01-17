/*global __dirname*/

const webpack            = require('webpack');
const merge              = require('webpack-merge');
const path               = require('path');
const WebpackShellPlugin = require('@slightlytyler/webpack-shell-plugin');

const isProd   = (process.env.NODE_ENV === 'production');
const isDev    = !isProd;

let targetDev  = {};
let targetProd = {};
let targetBase = {};

targetBase = {
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
  devServer: {
    stats: 'errors-only', // hide all those annoying warnings
  },
  plugins: []
};

if (isDev) {
  targetDev = require('./webpack/dev.config');
}

if (isProd) {
  targetProd = require('./webpack/production.config');
}

const webpackConfig = merge(targetBase, targetDev, targetProd);
module.exports = webpackConfig;
