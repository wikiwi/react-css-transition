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
    webpack: {
      resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
      },
      // as required by sinon: https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md.
      externals: {
        "react/addons": true,
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true,
      },
      devtool: "inline-source-map",
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
              module: "commonjs",
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
