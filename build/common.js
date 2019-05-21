const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'vue-loader' }
      },
      {
        test: /\.(less|css)$/,
        use: [ 'style-loader', 'css-loader', 'less-loader' ],
      },
//      {
//        test: /\.scss$/,
//        use: [ 'vue-style-loader', 'css-loader', 'sass-loader' ],
//      },
//      {
//        test: /.*\.(gif|png|jpe?g)$/i,
//        use: [ 'file-loader' ],
//      },
//      {
//        test: /.*\.svg$/i,
//        use: [ 'file-loader?name=[path][name].[ext]&context=./lib' ],
//      }
    ]
  }
}
