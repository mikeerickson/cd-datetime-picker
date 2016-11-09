var webpack              = require('webpack');
var path                 = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const TodoWebpackPlugin  = require('todo-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
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
  plugins: [

    // enabling this hoses the datetime controller bind ($dateTimeCtrl)
    // new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})

    new WebpackShellPlugin({onBuildEnd: ['gulp build']}),

    new TodoWebpackPlugin({
      console:  true,
      suppressFileOutput: true,
      tags: ['todo','error','fixme','bug','info','note']
    }),

  ]
};
