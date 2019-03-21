const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path");
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/js/index.js",

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].[contenthash].js"
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  devServer: {
    historyApiFallback: true,
    open: true,
    host: 'localhost', // If useLocalIp is set to true, use host '0.0.0.0'
    useLocalIp: false, 
    overlay: true,
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
      template: './src/index.html',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['build']
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new StyleLintPlugin({
      context: "src",
      files: "**/*.scss",
      syntax: "scss",
    }),
    new webpack.HashedModuleIdsPlugin()
  ],
};