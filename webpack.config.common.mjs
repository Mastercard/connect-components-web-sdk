import Dotenv from 'dotenv-webpack';
import path from 'node:path';

export default {
  entry: './src/index.ts',
  plugins: [new Dotenv()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve('dist'),
    // clean: true,
    // libraryTarget: 'module',
  },
};
