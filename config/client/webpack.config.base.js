const path = require("path");

const LoadablePlugin = require("@loadable/webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");
const WorkboxPlugin = require("workbox-webpack-plugin");

const {
  clientDir,
  distDir,
  publicPath,
  rootPath,
  sassAdditionalData,
  statsFilename,
} = require("../conf");
const { raw } = require("../env");
const webpackCommon = require("../webpack.common");

const isDevelopment = raw.NODE_ENV !== "production";

module.exports = merge(webpackCommon, {
  name: "client",
  target: "web",
  output: {
    path: path.join(rootPath, distDir, clientDir),
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              additionalData: sassAdditionalData,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      __isClient__: "true",
      __isServer__: "false",
    }),
    new LoadablePlugin({ filename: statsFilename }),
    new CopyPlugin({
      patterns: [path.join(rootPath, "public")],
    }),
    new CleanWebpackPlugin(),
    new WorkboxPlugin.GenerateSW({
      swDest: "sw.js",
      sourcemap: false,
      exclude: [/\.map$/, /.gz$/, new RegExp(statsFilename)],
      navigateFallback: `${raw.PUBLIC_URL}/index.html`,
      navigateFallbackDenylist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp("^/_"),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp("/[^/]+\\.[^/]+$"),
      ],
    }),
  ],
  node: {
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
});
