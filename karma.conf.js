const path = require("path");

module.exports = (config) => {
  config.set({
    browsers: ["Chrome"], // run in Chrome
    singleRun: true, // just run once by default
    frameworks: ["mocha"], // use the mocha test framework
    files: [
      "tests.webpack.js", // just load this file
    ],
    preprocessors: {
      "tests.webpack.js": ["webpack", "sourcemap"], // preprocess with webpack and our sourcemap loader
    },
    remapCoverageReporter: {
      "text-summary": null,
//      json: './coverage/coverage.json',
//      html: './coverage/html'
    },
    coverageReporter: {
      reporters: [
        { type: "in-memory" },
      ],
    },
    // TODO: enable coverage after https://github.com/deepsweet/istanbul-instrumenter-loader/pull/29.
    reporters: ["dots"], // , "coverage", "remap-coverage"], // report results in this format
    webpack: { // kind of a copy of your webpack config
      resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
      },
      externals: {
        "react/addons": true,
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true,
      },
      devtool: "inline-source-map", // just do inline source maps instead of the default
      module: {
        rules: [
          {
            test: /\.json$/,
            loader: "json",
          },
          {
            test: /\.tsx?$/,
            loader: "awesome-typescript",
            query: {
              sourceMap: true,
              useBabel: true,
              useCache: false,
            },
          },
          {
            enforce: "post",
            test: /\.tsx?$/,
            include: path.resolve("src"),
            loader: "istanbul-instrumenter",
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
