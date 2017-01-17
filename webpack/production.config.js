import webpack            from 'webpack';
import WebpackShellPlugin from '@slightlytyler/webpack-shell-plugin';

const webpackConfig = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new WebpackShellPlugin({onBuildEnd: ['gulp build:prod']})
  ]
};

module.exports = webpackConfig;
