"use strict";

const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const jsonlint = require("gulp-jsonlint");
const eslint = require("gulp-eslint");
const merge = require("merge2");
const yamllint = require("gulp-yaml-validate");
const sourcemaps = require("gulp-sourcemaps");

const files = {
  tsWithoutTest: ["./src/**/*.ts", "./src/**/*.tsx", "!./src/**/*.spec.tsx", "!./src/**/*.spec.ts"],
  tsWithTest: ["./src/**/*.ts", "./src/**/*.tsx", "test/**/*.ts", "test/**/*.tsx"],
  json: ["./*.json", "./.nycrc"],
  yaml: ["./*.yml"],
  js: ["./*.js"],
};

function onBuildError() {
  this.once("finish", () => process.exit(1));
}

function build(dest, module) {
  return () => {
    const tsProject = ts.createProject("tsconfig.json", {
      noEmitOnError: true,
      declaration: dest === "lib",
      target: "es5",
      module,
    });
    const tsResult = gulp.src(files.tsWithoutTest)
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .once("error", onBuildError);
    return merge([
      tsResult.dts.pipe(gulp.dest(dest)),
      tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(dest)),
    ]);
  };
}

gulp.task("lib", build("lib", "es6"));
gulp.task("commonjs", build("cjs", "commonjs"));

gulp.task("tslint", () => {
  return gulp.src(files.tsWithTest)
    .pipe(tslint({
      formatter: "verbose",
    }))
  .pipe(tslint.report());
});

gulp.task("eslint", () => {
  return gulp.src(files.js, { dot: true })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("jsonlint", () => {
  return gulp.src(files.json, { dot: true })
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task("yamllint", () => {
  return gulp.src(files.yaml, { dot: true })
    .pipe(yamllint());
});

gulp.task("lint", ["jsonlint", "eslint", "tslint", "yamllint"]);
gulp.task("default", ["lib", "commonjs"]);
