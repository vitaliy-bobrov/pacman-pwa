const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';

const outputPath = path.resolve(__dirname, 'dist');
const assetsPath = path.resolve(__dirname, 'assets');

const phaserRoot = path.join(__dirname, 'node_modules/phaser/build/custom/');

const phaserPath = path.join(phaserRoot, 'phaser-split.js');
const pixiPath = path.join(phaserRoot, 'pixi.js');
const p2Path = path.join(phaserRoot, 'p2.js');

const sw = new SWPrecacheWebpackPlugin({
  cacheId: 'pacman-cache',
  filename: 'service-worker.js',
  minify: true,
  staticFileGlobs: [
    `${outputPath}/assets/**/*`,
    `${outputPath}/*.{html,json,ico,png,svg}`
  ],
  stripPrefix: `${outputPath}/`
});

const bs = new BrowserSyncPlugin(
  {
    open: false,
    host: 'localhost',
    port: 4000,
    proxy: 'http://localhost:3000/'
  },
  {
    reload: false
  }
);

PLUGINS = IS_PROD ? [sw] : [bs];

function exposeRules(modulePath, name) {
  return {
    test: (path) => modulePath === path,
    loader: 'expose-loader',
    options: name
  };
}

module.exports = {
  devtool: IS_PROD ? false : 'cheap-source-map',
  entry: {
    pacman: path.resolve(__dirname, 'src/index.ts')
  },
  context: path.resolve(__dirname, 'src'),
  output: {
    path: outputPath,
    filename: `[name]${IS_PROD ? '.[chunkhash]' : ''}.bundle.js`,
    publicPath: ''
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js'],
    alias: {
      pixi: pixiPath,
      phaser: phaserPath,
      p2: p2Path
    }
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader']
      },
      exposeRules(pixiPath, 'PIXI'),
      exposeRules(p2Path, 'p2'),
      exposeRules(phaserPath, 'Phaser')
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: IS_PROD,
      comments: !IS_PROD
    }),
    new CleanWebpackPlugin([outputPath]),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'assets/**/*'),
        to: path.join(__dirname, 'dist/assets/')
      },
      {
        from: path.join(__dirname, 'src/*.{json,ico,png,svg,xml}'),
        to: path.join(__dirname, 'dist/')
      }
    ]),
    new HtmlWebpackPlugin({
      title: 'Pacman PWA',
      inject: true,
      template: 'index.html'
    }),
    ...PLUGINS
  ],
  devServer: {
    contentBase: outputPath,
    compress: true,
    port: 3000
  }
};
