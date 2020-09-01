const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tailwind = require('tailwindcss');
const webpack = require('webpack');
const path = require("path");

module.exports = (env, argv) => {
  const devMode = argv.mode === 'development';
  const dist = devMode ? '/' : '/wordpress/wp-content/themes/underscores/';
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: "./src/js/index.js",

    output: {
      path: path.resolve(__dirname, "wordpress/wp-content/themes/underscores"),
      publicPath: dist,
      filename: "js/[name].[contenthash].js",
      chunkFilename: "js/[name].[contenthash].js",
    },

    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
          }
        }
      }
    },

    devServer: {
      historyApiFallback: true,
      open: true,
      host: "localhost", // If useLocalIp is true, set host to '0.0.0.0'
      useLocalIp: false,
      overlay: true,
      proxy: {
        "/graphql": {
          "changeOrigin": true,
          "target": `https://${env.HOSTNAME}`
        },
      }
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
      test: /\.(js|jsx|mjs|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ["@babel/preset-env", { modules: "commonjs" }],
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-function-bind'
          ]
        }
      }
    },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
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
                  autoprefixer,
                  tailwind
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
        filename: devMode ? 'index.html' : 'index.php',
        base: devMode ? false : `https://${env.HOSTNAME}`
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
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