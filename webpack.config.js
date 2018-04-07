const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/js/main.js',
    mode: 'development',

    output: {
      path: __dirname + '/build',
      filename: 'bundle.js'
    },
  
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            { loader: 'babel-loader' },
          ],
          exclude: /node_modules/
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
                    }
                }
            },
            {
                loader: "sass-loader",
                options: {}
            }
          ]
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css",
      })
    ],
  };