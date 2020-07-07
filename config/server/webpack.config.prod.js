const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const NodeExternals = require("webpack-node-externals");

const { assetsDir, rootPath, sassAdditionalData } = require("../conf");
const webpackProd = require("../webpack.prod");
const webpackBase = require("./webpack.config.base");

module.exports = merge(webpackBase, webpackProd, {
  entry: {
    server: path.join(rootPath, "./src/server/index.ts"),
  },
  output: {
    chunkFilename: path.join(
      assetsDir,
      "js",
      "[name].[contenthash:7].chunk.js"
    ),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.s(c|a)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
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
  externals: [NodeExternals()],
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join(assetsDir, "css", "[name].[contenthash:7].css"),
      chunkFilename: path.join(
        assetsDir,
        "css",
        "[name].[contenthash:7].chunk.css"
      ),
    }),
  ],
});
