import TodoWebpackPlugin  from 'todo-webpack-plugin';
import WebpackShellPlugin from '@slightlytyler/webpack-shell-plugin';

const webpackConfig = {
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

module.exports = webpackConfig;
