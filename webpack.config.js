const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

module.exports = env => {
  return {
    mode: env.NODE_ENV,
    devtool: 'inline-source-map',
    entry: {
      popup: './src/popup.js',
      setup: './src/setup.js',
      background: './src/background.js',
      update: './src/update.js'
    },
    output: {
      path: path.resolve(__dirname, 'public'), // Changed 'dist' to 'public'
      filename: '[name].bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, './src'),
            /pretty-bytes/ // <- ES6 module
          ],
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader'
          ]
        },
        {
          test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
          use: 'file-loader?limit=100000'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            'file-loader?limit=100000',
            {
              loader: 'img-loader',
              options: {
                enabled: true,
                optipng: true
              }
            }
          ]
        }
      ]
    },
    stats: {
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false
    },
    performance: {
      hints: false
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({
        inject: true,
        chunks: ['popup'],
        filename: 'popup.html',
        template: './src/popup.html'
      }),
      new HtmlWebpackPlugin({
        inject: true,
        chunks: ['setup'],
        filename: 'setup.html',
        template: './src/setup.html'
      }),
      // copy extension manifest and icons
      new CopyWebpackPlugin([
        { from: './src/manifest.json' },
        { context: './src/assets', from: 'icon-**', to: 'assets' }
      ])
    ]
  };
};

// Post build script to rename 'dist' to 'public'
const source = path.resolve(__dirname, 'dist');
const destination = path.resolve(__dirname, 'public');

// Check if 'dist' exists before renaming
if (fs.existsSync(source)) {
  fs.renameSync(source, destination, err => {
    if (err) throw err;
    console.log('Successfully renamed the directory.');
  });
}
