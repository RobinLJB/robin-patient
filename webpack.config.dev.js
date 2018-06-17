const webpack = require('webpack');
//加载webpack模块
const HtmlWebpackPlugin = require('html-webpack-plugin');
//html模板模块
const CopyWebpackPlugin = require('copy-webpack-plugin');
//静态资源复制模块
const path = require('path');

'use strict';

module.exports = {
  devtool: 'eval-source-map', // 创建代码链接
  //输入
  entry: {
    app: __dirname + '/src/app.js' // 编译入口是app.js
  },
  //输出
  output: {
    path: __dirname + '/dev', //测试输出目录
    filename: '[hash:8][name].js' //用回编译前的key名字
  },
  //服务器设置
  devServer: {
    useLocalIp: true, //用本地ip
    hot: true, //允许热替换
    contentBase: '/dev', //访问目录
    inline: true, //源文件改变后 浏览器自动更新
    host: '0.0.0.0', //允许所有地址访问
    port: 8191, //端口
    open: true, //执行时 打开浏览器
    historyApiFallback: true //适合单页应用
  },
  //别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  //非js模块加载器
  module: {
    rules: [
      {
        //此类后缀文件用 babel编译器编译
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              'react', 'env', 'stage-1'
            ],
            'env': {
              'development': {
                'plugins': [
                  [
                    'react-transform', {
                      'transforms': [
                        {
                          'transform': 'react-transform-hmr',
                          'imports': ['react'],
                          'locals': ['module']
                        }
                      ]
                    }
                  ]
                ]
              }
            }
          }
        },
        include: /src/
      }, { //静态css样式加载器
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader' //css文件应用到dom节点上
          }, {
            loader: 'css-loader', //可以读取css文件
            options: {
              modules: false //样式全局化 不能自我调用
            }
          }
        ],
        include: /(src|weui|react-weui|bulma|owo)/
      }, { //sass样式编译器 静态css样式加载器 编译bulma样式
        test: /\.sass$/,
        use: [
          {
            loader: 'style-loader' //css文件应用到dom节点上
          }, {
            loader: 'css-loader', //可以读取css文件
            options: {
              modules: false //样式全局化 不能自我调用
            }
          }, {
            loader: 'sass-loader'
          }
        ]
      }, {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ],
        include: /font-awesome/
      }, { // woff字体加载器
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=asset/[hash:8][name].[ext]'
          }
        ]
      }, { //图片加载器
        test: /\.(gif|jpg|jpeg|png)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader?limit=10000&name=asset/[hash:8][name].[ext]'
          }
        ]
      }, { //静态less样式加载器
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader' //css文件应用到dom节点上
          }, {
            loader: 'css-loader', //可以读取css文件
            options: {
              modules: false //样式全局化 不能自我调用
            }
          },{
            loader: 'less-loader', //可以读取css文件
          }
        ],
        include: /(src)/
      }, { //ico加载器
        test: /\.ico?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader?limit=10000&name=favicon.ico'
          }
        ]
      }, { //矢量文件加载器
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader?name=asset/[hash:8][name].[ext]'
          }
        ]
      }
    ]
  },

  //插件
  plugins: [
    //全局变量
    new webpack.DefinePlugin({
      //LOCAL_ROOT: '\'robinluo.top\''
      LOCAL_ROOT: '\'localhost:8081\''
    }),
    //html模板插件
    new HtmlWebpackPlugin({
      //页面title
      title: '享点医',
      //模板地址
      template: __dirname + '/src/index.tmpl.html',
      //js导入分类
      chunks: ['vendor', 'app']
    }),
    //热部署插件
    new webpack.HotModuleReplacementPlugin(),
    //js分类插件 依赖包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[hash:8][name].js',
      minChunks(module) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      }
    }),
    new CopyWebpackPlugin([
      {
        from: __dirname + '/src/image/favicon.ico',
        to: '[name].[ext]'
      }, {
        from: __dirname + '/src/OwO.json',
        to: '[name].[ext]'
      }, {
        from: __dirname + '/src/image/head.png',
        to: '[name].[ext]'
      }, {
        from: __dirname + '/src/image/LOGOxdy2.jpeg',
        to: '[name].[ext]'
      }
    ])
  ]

};
