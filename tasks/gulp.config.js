
module.exports = {
  entry: 'index.js',
  src: './src/**/*.js',
  dest: './dist',
  buildFilename: 'bundle.js',
  publicPath: '/public/',
  webpack: {
    scripts: ['./src/components/**/*.js','!./src/components/**/*Spec.js']
  },
  playground: {
    src: './playground/**/*.js',
    exclude: [
      '!./playground/ng-annotate/modules/**/*.js',
      '!./playground/ng-annotate/scripts/**/*.js'
    ],
  },
  test: {
    unit: {
      src: './specs/**/*Spec.js'
    }
  },
  todo: {
    openReport: false,
    src: [
      './public/**/*.{js,es6,jsx}',
      './tasks/**/*.js',
      './test/**/*.spec.js',
    ],
    exclude: ['logs', './dist','./node_modules','./public/vendor/**/*'],
    output: './TODO.md'
  }

};
