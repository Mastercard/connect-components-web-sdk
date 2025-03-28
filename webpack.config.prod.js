// const { merge } = require('webpack-merge');
// const common = require('./webpack.config.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const webFormat = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
      }),
    ],
  },
  entry: './src/index.js',
  plugins: [new Dotenv()],
  output: {
    filename: 'web.js',
    path: path.resolve(__dirname, 'dist'),
    clean: false,
    // libraryTarget: 'var',
    library: {
      name: 'ConnectComponents',
      type: 'var',
    },
  },
};

const moduleFormat = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
      }),
    ],
  },
  entry: './src/index.js',
  plugins: [new Dotenv()],
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'sdk.mjs',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    libraryTarget: 'module',
  },
};

const commonJSFormat = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
      }),
    ],
  },
  entry: './src/index.js',
  plugins: [new Dotenv()],
  output: {
    filename: 'sdk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: false,
    libraryTarget: 'commonjs2',
  },
};

module.exports = [moduleFormat, commonJSFormat, webFormat];
