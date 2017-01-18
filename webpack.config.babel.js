/*global __dirname*/

import webpack from'webpack';
import merge   from 'webpack-merge';
import path    from 'path';

import WebpackShellPlugin from '@slightlytyler/webpack-shell-plugin';

import targetBase from './webpack/base.config';

const isProd   = (process.env.NODE_ENV === 'production');
const isDev    = !isProd;

let targetDev  = {};
let targetProd = {};

if (isDev) {
  targetDev = require('./webpack/dev.config');
}

if (isProd) {
  targetProd = require('./webpack/production.config');
}

const webpackConfig = merge(targetBase, targetDev, targetProd);
module.exports = webpackConfig;
