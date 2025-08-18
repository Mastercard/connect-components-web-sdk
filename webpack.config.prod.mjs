import {merge} from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import common from './webpack.config.common.mjs';

const commonProd = {
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
}

const iifeFormat = merge(common, commonProd, {
  output: {
    filename: 'mastercard-connect-components-iife.min.js',
    clean: false,
    library: {
      name: 'ConnectComponents',
      type: 'var',
    },
  },
});

const ESMFormat = merge(common, commonProd, {
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'mastercard-connect-components-esm.min.js',
    clean: false,
    module: true,
    library: {
      type: 'module'
    },
  },
});

const commonJSFormat =  merge(common, commonProd, {
  output: {
    filename: 'mastercard-connect-components-cjs.min.js',
    clean: false,
    library: {
      name: 'Connect-Components-Web-SDK',
      type: 'commonjs2'
    }
  },
});

const UMDFormat =  merge(common, commonProd, {
  output: {
    filename: 'mastercard-connect-components-umd.min.js',
    clean: false,
    library: {
      name: 'Connect-Components-Web-SDK',
      type: 'umd2'
    }
  },
});

export default [ESMFormat, commonJSFormat, iifeFormat, UMDFormat];
