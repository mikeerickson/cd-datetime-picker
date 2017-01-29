import path  from 'path';
import merge from 'webpack-merge';
import chalk from 'chalk';

import BuildNotifierPlugin from 'webpack-build-notifier';
import ProgressBarPlugin   from 'progress-bar-webpack-plugin';
import SemverPlugin        from 'semver-extended-webpack-plugin';

const isProd   = (process.env.NODE_ENV === 'production') || (process.env.ENV === 'production');
const isDev    = !isProd;

// let targetBase = require('./webpack/base.config');
let targetDev  = isDev  ? require('./webpack/dev.config') : {};
let targetProd = isProd ? require('./webpack/production.config') : {};

const webpackConfig = {
  entry: './src/datetime-picker.directive.js',
  output: {
    path: './build',
    filename: 'datetime-picker.directive.js'
  },
  module: {
    rules: [
      {test: /\.js?$/, loaders: ['babel-loader'], exclude: /node_modules/},
      {test: /\.html?$/, loaders: ['html-loader']},
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  plugins: [
    new ProgressBarPlugin({
      format: chalk.yellow.bold(`Building ${isDev ? 'Development' : 'Production'} [:bar] `) + chalk.green.bold(':percent') + chalk.bold(' (:elapsed seconds)'),
      clear: true,
      summary: false
    }),
    new BuildNotifierPlugin({
      title: 'cd-datetime-picker',
      logo: path.resolve(__dirname, 'src/assets/cd-logo.png')
    })
  ]
};

if (isDev) {
  webpackConfig.devtool = 'source-map';
  webpackConfig.plugins.push(
    new SemverPlugin({
      files: [path.resolve(__dirname, 'package.json')],
      incArgs: ['prerelease','build']
    })
  );
}

module.exports = merge(webpackConfig, targetDev, targetProd);
