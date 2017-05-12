import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';

const webpackConfig = {
  entry: path.resolve('./public/public_assets/sw.js'),
  output: {
    filename: 'sw.js',
    path: path.resolve('./public/public_assets/'),
    chunkFilename: 'sw.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
        warnings: false
      }
    }),
    new CompressionPlugin({
      asset: '{file}.gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.html$|\.css$/,
      threshold: 1024,
      minRatio: 0.9
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0'],
          env: {
            production: {
              presets: ['react-optimize']
            }
          }
        }
      }
    ]
  }
};

export default webpackConfig;
