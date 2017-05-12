import webpack       from 'webpack';
import config        from '../../config';
import webpackConfig from './development';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

webpackConfig.entry.app.push(
  `webpack-dev-server/client?${config.get('webpack_public_path')}`,
  `webpack/hot/dev-server`
);

webpackConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new ExtractTextPlugin('[name].css', {
    disable: false,
    allChunks: true
  }),
);

// We need to apply the react-transform HMR plugin to the Babel configuration,
// but _only_ when HMR is enabled. Putting this in the default development
// configuration will break other tasks such as test:unit because Webpack
// HMR is not enabled there, and these transforms require it.
webpackConfig.module.loaders = webpackConfig.module.loaders.map(loader => {
  if (/css/.test(loader.test)) {
    const [first, ...rest] = loader.loaders;
    const sassLoader = rest.pop();
    rest.push('postcss-loader');
    rest.push(sassLoader);
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
  }

  return loader;
});

export default webpackConfig;
