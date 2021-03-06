// This is the webpack config to use during development.
import path from "path";
import webpack from "webpack";
import WebpackErrorNotificationPlugin from "webpack-error-notification";
import writeStats from "./utils/write-stats";
import notifyStats from "./utils/notify-stats";

const dist = path.resolve(__dirname, '../public/assets');
const host = 'localhost';
const port = parseInt(process.env.PORT) + 1 || 3001;

const config = {
  devtool: 'eval-source-map',
  entry: {
    main: [
      'babel-polyfill',
      'webpack-dev-server/client?http://' + host + ':' + port,
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './src/app/client.js'
    ]
  },
  output: {
    filename: '[name]-[hash].js',
    path: dist,
    publicPath: 'http://' + host + ':' + port + '/assets/'
  },

  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|xml|json|css|js)$/,
        include: [/dev\/assets\/static/, /src\/assets\/static/],
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|woff2|woff|ttf)$/,
        exclude: [/dev\/assets\/static/, /src\/assets\/static/],
        loader: 'file-loader'
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/, /dev\/assets\/static/, /src\/assets\/static/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ["env", {
                  "targets": {
                    "browsers": [ "ie 11" ]
                  }
                }],
                "stage-0",
                "react"
              ],
            },
          },
        ]
      },
      {
        test: /\.(s?css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: ['Last 2 versions', 'iOS 7']
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            }
          },
        ]
      },
    ]
  },

  plugins: [
    // hot reload
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
      }
    }),
    new WebpackErrorNotificationPlugin(),

    // stats
    function () {
      this.plugin("done", notifyStats);
    },
    function () {
      this.plugin("done", writeStats);
    },

    // print a webpack progress
    new webpack.ProgressPlugin(function(percentage, message) {
      var MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
      var CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();
      process.stdout.write(CLEAR_LINE + Math.round(percentage * 100) + "% :" + message + MOVE_LEFT);
    })
  ]
};

export default config;