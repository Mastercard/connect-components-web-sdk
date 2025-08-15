const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.mjs');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  output: {
    filename: 'dev.sdk.js',
  },
});
