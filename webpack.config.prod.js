const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new Dotenv()
  ],
  output: {
    filename: 'sdk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};