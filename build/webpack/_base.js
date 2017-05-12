import webpack           from 'webpack';
import config            from '../../config';
import BundleTracker     from 'webpack-bundle-tracker';
import AssetsPlugin from 'assets-webpack-plugin';
import path from 'path';
import yamljs from 'yamljs';
const env = process.env.NODE_ENV;
const Config = yamljs.load(path.resolve(__dirname, '../../config/application.yml'));
const cdn = Config.cdn_path;
const manifest = (function () {
  try {
    return require(`${path.resolve(__dirname, '../../')}/manifest.json`);
  } catch (e) {
    return {};
  }
})();
const autoprefixer = require('autoprefixer');
const precss = require('precss');

const paths = config.get('utils_paths');

const webpackConfig = {
  name: 'app',
  target: 'web',
  entry: {
    app: [
      `${paths.project(config.get('dir_src'))}/app.js`
    ],
    vendor : config.get('vendor_dependencies')
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: paths.project(config.get('dir_dist')),
    publicPath: `${cdn}/`
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['app', 'vendor', 'manifest'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin(config.get('globals')),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new BundleTracker(),
    new AssetsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: config.get('utils_aliases')
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0']
        }
      },

      {
        test: /\w*\.ttf(\?.*)?$/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'application/octet-stream',
          cdn_base: cdn,
          manifest,
          env
        }
      },
      {
        test: /\w*\.woff(\?.*)?$/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'application/font-woff',
          cdn_base: cdn,
          manifest,
          env
        }
      },
      {
        test: /\w*\.woff2(\?.*)?$/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'application/font-woff2',
          cdn_base: cdn,
          manifest,
          env
        }
      },
      {
        test: /\w*\.eot(\?.*)?$/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'application/octet-stream',
          cdn_base: cdn,
          manifest,
          env
        }
      },
      {
        test: /\w*\.svg(\?.*)?$/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'image/svg+xml',
          cdn_base: cdn,
          manifest,
          env
        }
      },

      {
        test: /\.png$/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'image/png',
          cdn_base: cdn,
          manifest,
          env
        }
      },

      {
        test: /\.jpg$/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'image/jpg',
          cdn_base: cdn,
          manifest,
          env
        }
      },

      {
        test: /\.gif/,
        loader: path.resolve(__dirname, 'hash-loader'),
        query: {
          mimetype: 'image/gif',
          cdn_base: cdn,
          manifest,
          env
        }
      },

      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  sassLoader: {
    includePaths: paths.src('styles')
  },
  postcss() {
    return [precss, autoprefixer];
  }
};

export default webpackConfig;
