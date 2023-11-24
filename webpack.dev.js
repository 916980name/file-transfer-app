const { merge } = require('webpack-merge')
const base = require('./webpack.base.js')

module.exports = merge(base, {
  mode: 'development', // 开发模式
  devtool: 'source-map',
  devServer: {
    // contentBase: resolve(__dirname, '_dest'),//本地打包文件的位置
    open: true, // 编译完自动打开浏览器
    port: 3000,
  },
})