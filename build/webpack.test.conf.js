// webpack.config.js
// Build bundles for the pages in the test folder
var path = require('path')
const Common = require('./common')
                
module.exports = {
  mode: 'development',
  entry: './src/tempus.js',
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'tempus-bundle.js'
  },
  resolve: Common.resolve,
  plugins: Common.plugins,
  module: Common.module,
  devServer: {
       port: 3400,
       host: '0.0.0.0',	disableHostCheck: true,	//To browse from different host on lan
       hot: true, hotOnly: true,
       contentBase: 'dist',			//Serve files from here
   }
}
