const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'sdk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};