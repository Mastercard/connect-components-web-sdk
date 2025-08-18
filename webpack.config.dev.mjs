import { merge } from 'webpack-merge';
import common from './webpack.config.common.mjs';

export default merge(common, {
  devtool: 'inline-source-map',
  output: {
    filename: 'dev.sdk.js',
  },
});
