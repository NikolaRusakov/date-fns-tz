const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  entry: getEntryConfig(),
  output: getOutputConfig(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!date-fns)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
            plugins: [
              '@babel/plugin-transform-optional-chaining',
              '@babel/plugin-transform-logical-assignment-operators',
              '@babel/plugin-transform-nullish-coalescing-operator',
            ],
          },
        },
      },
    ].concat(
      process.env.COVERAGE_REPORT
        ? [
            {
              test: /\.js$/,
              use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true },
              },
              enforce: 'post',
              exclude: /node_modules|test.js|src\/locale$/,
            },
          ]
        : []
    ),
  },
}

module.exports = config

function getEntryConfig() {
  if (process.env.BUILD_TESTS) {
    return {
      tests: './testWithoutLocales.js',
    }
  } else if (process.env.NODE_ENV === 'test') {
    return undefined
  } else {
    return {
      date_fns: './tmp/umd/index.js',
    }
  }
}

function getOutputConfig() {
  if (process.env.BUILD_TESTS) {
    return {
      path: path.join(process.cwd(), 'tmp'),
      filename: '[name].js',
    }
  } else if (process.env.NODE_ENV === 'test') {
    return undefined
  } else {
    return {
      path: path.join(process.cwd(), 'dist'),
      filename: '[name].js',
      library: 'dateFns',
      libraryTarget: 'umd',
    }
  }
}
