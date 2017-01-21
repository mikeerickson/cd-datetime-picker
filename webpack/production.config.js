import webpack            from 'webpack';
import WebpackShellPlugin from '@slightlytyler/webpack-shell-plugin';
import BabiliPlugin       from 'babili-webpack-plugin';

const webpackConfig = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new WebpackShellPlugin({onBuildEnd: ['gulp build:prod']}),
    new BabiliPlugin({})
  ]
};

module.exports = webpackConfig;
