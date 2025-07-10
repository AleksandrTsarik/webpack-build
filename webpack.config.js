const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: 'assets/[hash][ext][query]'
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: false,
                minimize: false
              }
            },
            {
              loader: 'posthtml-loader',
              options: {
                plugins: [
                  require('posthtml-include')({ root: __dirname + '/src' })
                ]
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(woff2?|ttf|otf|eot)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        },
        {
          test: /\.(jpe?g|png)$/i,
          include: path.resolve(__dirname, 'src/assets/images'),
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[path][name].[contenthash].[ext]',
                context: path.resolve(__dirname, 'src/assets/images'),
                esModule: false
              }
            },
            {
              loader: 'webp-loader',
              options: {
                quality: 80
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: { progressive: true },
                pngquant: { quality: [0.7, 0.9] }
              }
            }
          ],
          type: 'javascript/auto'
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/pages/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css',
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      open: true,
      hot: true,
      watchFiles: ['src/**/*'],
      port: 3000,
    },
    resolve: {
      extensions: ['.js'],
    },
    devtool: isProd ? false : 'source-map',
    mode: isProd ? 'production' : 'development',
  };
}; 