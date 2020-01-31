const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require("path");

module.exports = (env, argv) => {
  const devMode = argv.mode === 'development';
  const dist = devMode ? '/' : '/wp-content/themes/blankslate/';
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: "./src/js/index.js",

    output: {
      path: path.resolve(__dirname, "wordpress/wp-content/themes/blankslate"),
      publicPath: dist,
      filename: "[name].[contenthash].js",
    },

    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      }
    },

    devServer: {
      historyApiFallback: true,
      open: true,
      host: "localhost", // If useLocalIp is true, set host to '0.0.0.0'
      useLocalIp: false,
      overlay: true
    },

    devtool: "source-maps",

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
                sourceMap: true
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
                  sourceMap: true
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
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
                name: "[name].[hash].[ext]",
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
        filename: devMode ? 'index.html' : 'index.php'
      }),
      new CleanWebpackPlugin(
        [
          "wordpress/wp-content/themes/blankslate/fonts",
          "wordpress/wp-content/themes/blankslate/images",
          "wordpress/wp-content/themes/blankslate/*.js",
          "wordpress/wp-content/themes/blankslate/*.js.map",
          "wordpress/wp-content/themes/blankslate/*.css",
          "wordpress/wp-content/themes/blankslate/*.css.map",
        ],
        {
          verbose:  true,
          dry:      false
        }
      ),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new webpack.HashedModuleIdsPlugin(),
      new StyleLintPlugin({
        context: "src",
        files: "**/*.scss",
        syntax: "scss",
      }),
      new webpack.DefinePlugin(envKeys),
    ],
  }
};