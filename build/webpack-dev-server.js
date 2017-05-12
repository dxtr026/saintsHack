import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from '../config';
import webpackConfig from './webpack/development_hot';

const paths = config.get('utils_paths');
const middleware = webpackMiddleware(webpack(webpackConfig), {
  contentBase: paths.project(config.get('dir_src')),
  hot: true,
  quiet: false,
  noInfo: false,
  lazy: false,
  stats: {
    assets: true,
    colors: true,
    version: true,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  historyApiFallback: true
});

export default middleware;
