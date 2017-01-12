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
  const TodoWebpackPlugin = require('todo-webpack-plugin');

  targetDev = {
    devtool: 'sourcemap',
    plugins: [
      new WebpackShellPlugin({onBuildEnd: ['gulp build:dev']}),
      new TodoWebpackPlugin({
        console:  true,
        suppressFileOutput: false,
        tags: ['todo','error','fixme','bug','info','note']
      }),
    ]
  };
}

if (isProd) {
  targetProd = {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
      new WebpackShellPlugin({onBuildEnd: ['gulp build:prod']})
    ]
  };
}

const webpackConfig = merge(targetBase, targetDev, targetProd);
module.exports = webpackConfig;
