const webpackMerge = require('webpack-merge');

const isProd   = (process.env.NODE_ENV === 'production') || (process.env.ENV === 'production');
const isDev    = !isProd;

let targetBase = require('./webpack/base.config');
let targetDev  = isDev  ? require('./webpack/dev.config') : {};
let targetProd = isProd ? require('./webpack/production.config') : {};

module.exports = webpackMerge(targetBase, targetDev, targetProd);
