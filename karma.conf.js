"use strict";

const path = require("path");

module.exports = (config) => {
  config.set({
    browsers: ["Chrome"],
    singleRun: true,
    frameworks: ["mocha"],
    files: [
      "tests.webpack.js",
    ],
    preprocessors: {
      "tests.webpack.js": ["webpack", "sourcemap"],
    },
    remapCoverageReporter: {
      text: null,
      lcovonly: "./coverage/lcov-integration.info",
//      json: './coverage/coverage.json',
//      html: './coverage/html'
    },
    coverageReporter: {
      reporters: [
        { type: "in-memory" },
      ],
    },
    reporters: ["dots", "coverage", "remap-coverage"],
    webpack: {
      resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
      },
      // as required by sinon: https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md.
      externals: {
        "react/addons": "react",
        "react/lib/ExecutionEnvironment": "react",
        "react/lib/ReactContext": "react",
      },
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.json$/,
            loader: "json-loader",
          },
          {
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader",
            query: {
              sourceMap: true,
              module: "commonjs",
            },
          },
          {
            enforce: "post",
            test: /\.tsx?$/,
            include: path.resolve("src"),
            loader: "istanbul-instrumenter-loader",
            exclude: [
              /\.spec\.tsx?$/,
              /node_modules/,
            ],
          },
        ],
      },
    },
    webpackServer: {
      noInfo: true,
    },
  });
};
