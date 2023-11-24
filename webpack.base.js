// https://juejin.cn/post/7228845572618371133
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'), // 打包后的代码放在dist目录下
    filename: '[name].[hash:8].js', // 打包的文件名
    publicPath: '/',
  },
  externals: {
    react: 'React'
  },
  resolve: {
    // 配置 extensions 来告诉 webpack 在没有书写后缀时，以什么样的顺序去寻找文件
    extensions: ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx'], // 如果项目中只有 tsx 或 ts 可以将其写在最前面
  },
  module: {
    rules: [
      {
        test: /.(jsx?)|(tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'iOS 9, Android 4.4, last 2 versions, > 0.2%, not dead', // 根据项目去配置
                  useBuiltIns: 'usage', // 会根据配置的目标环境找出需要的polyfill进行部分引入
                  corejs: 3, // 使用 core-js@3 版本
                },
              ],
              ['@babel/preset-typescript'],
              ['@babel/preset-react', {
                runtime: 'automatic', // 这句是关键      
              }],
            ],
          },
        },
      },
      {
        // 处理less资源
        test: /\.less$/,
        use: [
          'style-loader', //创建style标签，将js中的样式资源插入进行，添加到head中生效
          'css-loader', //将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'less-loader' //将less文件编译成css文件
        ]
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: [ // use数组中loader执行顺序：从右到左，从下到上 依次执行
          'style-loader',// 创建style标签，将js中的样式资源插入进行，添加到head中生效
          'css-loader'// 将css文件变成commonjs模块加载js中，里面内容是样式字符串
        ]
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader', //url-loader是对file-loader的上层封装
        options: {
          limit: 8 * 1024, //临界值为8KB，小于8KB的图片会被转为base64编码
          name: '[hash:10].[ext]', //加工后图片的名字
          outputPath: 'imgs' //输出路径
        }
      },
      {
        // 处理html中<img>资源
        test: /\.html$/,
        loader: 'html-loader'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 以当前文件为模板创建新的HtML(1. 结构和原来一样 2. 会自动引入打包的资源)
      template: './public/index.html',
    }),
  ]
}
