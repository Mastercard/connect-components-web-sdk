const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  plugins: [new Dotenv()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
