const path = require('path');
const incstr = require('incstr');

const DefinePlugin = require('webpack').DefinePlugin;
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');

const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789'
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = generateNextId();

    return index[name];
  };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath.split('/').slice(-2, -1);

  return uniqueIdGenerator(componentName) + '_' + uniqueIdGenerator(localName);
};

module.exports = (env, { mode }) => {
  const [DEV, PROD] = ['development', 'production'];

  console.log(`App is running in ${mode} mode`);

  const config = {
    mode,

    devtool: mode === PROD ? false : 'inline-source-map',

    entry: path.resolve(__dirname, 'src/index.tsx'),

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        styles: path.resolve(__dirname, 'src/styles')
      },
      plugins: [new TsConfigPathsPlugin()]
    },

    output: {
      path: __dirname + '/dist',
      filename: '[name].[hash].js',
      publicPath: '/'
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader'
        },
        {
          test: /\.scss$/,
          exclude: path.resolve(__dirname, 'src/styles/'),
          use: [
            'style-loader',
            'css-modules-typescript-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: mode === DEV ? true : false,
                modules: {
                  localIdentName: '[local]___[hash:base64:5]'
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.scss$/,
          include: path.resolve(__dirname, 'src/styles/'),
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.html$/,
          use: ['html-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
          loader: 'url-loader',
          options: {
            limit: 10 * 1024
          }
        },
        {
          test: /\.svg$/,
          loader: 'svg-url-loader',
          options: {
            limit: 10 * 1024,
            noquotes: true
          }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'image-webpack-loader',
          enforce: 'pre'
        },
        {
          test: /\.(config)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        }
      ]
    },

    plugins: [
      new HtmlWebPackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        inject: 'body',
        hash: true
      }),
      new InterpolateHtmlPlugin({
        PUBLIC_URL: 'public'
      }),
      new DefinePlugin({
        __IMAGES_PATH__: mode === DEV ? "'public/images'" : "'images'",
        __CORE_API_PATH__: "'https://pillar-api-dev.azurewebsites.net/api/'"
        // TODO UNCOMMENT THIS AFTER FE PROD ENVIRONMENT READY
        // mode === DEV
        //   ? "'https://pillar-api-dev.azurewebsites.net/api/'"
        //   : "'https://pillar-api.azurewebsites.net/api/'"
      })
    ],

    devServer: {
      historyApiFallback: true,
      port: 3000
    }
  };

  if (mode === PROD) {
    config.optimization = {
      minimize: true,
      concatenateModules: true,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        cacheGroups: {
          default: false, // Removes default config

          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // We creating here node_modules single package name
              return `npm.${module.context
                .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                .replace('@', '')}`;
            },
            minSize: 0
          }
        }
      }
    };

    config.plugins.push(new CopyPlugin([{ from: 'public', ignore: ['index.html'] }]));
  }

  if (mode !== PROD) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        openAnalyzer: false
      })
    );
  }

  return config;
};
