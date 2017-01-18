import path from 'path';

const APP_ROOT = path.resolve(__dirname, '..','src');

const targetBase = {
  context: APP_ROOT + '/src',
  entry: {
    app: path.join(APP_ROOT, 'datetime-picker.directive.js')
  },
  output: {
    path: path.join(APP_ROOT, '/build'),
    filename: 'datetime-picker.directive.js'
  },
  module: {
    loaders: [
      {test: /\.js?$/, loaders: ['ng-annotate','babel'], exclude: /node_modules/},
      {test: /\.html?$/, loaders: ['raw']},
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
  plugins: []
};

export default targetBase;
