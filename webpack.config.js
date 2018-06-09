const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");

const dist = "build/";
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/js/index.js",

  output: {
    path: __dirname + '/' + dist,
    publicPath: '/' + dist,
    filename: "bundle.js"
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
        loader: "babel-loader",
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
    new CleanWebpackPlugin([
        dist + "/images",
        dist + "/fonts",
        dist + "/*.map",
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