import webpack            from 'webpack';
import WebpackShellPlugin from '@slightlytyler/webpack-shell-plugin';

// have to use require instead of import here
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackConfig = {
  plugins: [
    // new UglifyJSPlugin(),
    new WebpackShellPlugin({onBuildEnd: ['gulp build:prod']}),
  ]
};

module.exports = webpackConfig;
