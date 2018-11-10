const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path");

const dist = "/";
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/js/index.js",

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js"
  },

  /*
    In order to access the webpack dev server on a mobile device,
    find your computer's address on the network. In terminal, 
    type ifconfig and look for the en1 section or the one 
    with something like inet 192.168.1.111 */
  devServer: {
    historyApiFallback: true,
    open: true,
    host: '0.0.0.0',
    public: 'localhost:8080'
  },

  devtool: devMode ? 'source-maps' : false,

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "react", 
                "es2015", 
                "stage-0"
              ]
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              minimize: {
                safe: true
              },
              sourceMap: devMode ? true : false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              autoprefixer: {
                browsers: ["last 5 versions"]
              },
              plugins: () => [
                autoprefixer
              ],
              options: {
                sourceMap: devMode ? true : false
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: devMode ? true : false
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jp(e*)g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './build/index.html',
      inject: false
    }),
    new CleanWebpackPlugin([
      "build/images",
      "build/fonts",
      "build/*.map",
    ]),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new StyleLintPlugin({
      context: "src",
      files: "**/*.scss",
      syntax: "scss",
    })
  ],
};