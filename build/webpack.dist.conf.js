// webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals')
const Common = require('./common')
                
module.exports = {
  entry: './src/tempus.js',
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'tempus-bundle.js'
  },
//  externals: [nodeExternals()],
  devtool: 'source-map',
  resolve: Common.resolve,
  plugins: Common.plugins,
  module: Common.module
}
