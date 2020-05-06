'use strict'

const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: {
    mobile: './client/timer/app.js',
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: './timer.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}