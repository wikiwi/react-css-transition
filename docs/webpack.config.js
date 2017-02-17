"use strict";

const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;

const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  output: { comments: false },
  mangle: true,
  sourceMap: true,
});
const reactPresets = process.env.NODE_ENV === "production" ? ["react", "react-optimize"] : ["react"];
const additionalPlugins = process.env.NODE_ENV === "production" ? [uglifyPlugin] : [];

module.exports = {
  entry: ["babel-polyfill", "./src/app.tsx"],
  devtool: "sourcemap",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".txt"],
    modules: ["../node_modules"],
    plugins: [new TsConfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.css.ts$/,
        use: [
          "style-loader",
          "css-loader?modules&importLoaders=1",
          "postcss-loader",
          "css-in-js-loader",
        ],
      },
      {
        test: /\.txt?$/,
        loader: "raw-loader",
        exclude: path.resolve(__dirname, "../node_modules"),
      },
      {
        test: /(\.jsx?|\.tsx?)$/,
        loader: "awesome-typescript-loader",
        exclude: path.resolve(__dirname, "../node_modules"),
        query: {
          useBabel: true,
          babelCore: path.resolve(__dirname, "../node_modules/babel-core"),
          babelOptions: {
            presets: reactPresets,
          },
        },
      },
      {
        test: /\.(woff|woff2)/,
        loader: "url-loader",
        query: {
          limit: 8912,
        },
      },
      {
        test: /(\.js|\.jsx)$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, "../node_modules/react-icons"),
        query: {
          presets: ["es2015", ...reactPresets],
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "",
    filename: "app.js",
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "src/index.html" },
      { from: "media/preview.jpg" },
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    ...additionalPlugins,
  ],
};
