const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const jsonlint = require("gulp-jsonlint");
const eslint = require("gulp-eslint");
const merge = require("merge2");
const yamllint = require("gulp-yaml-validate");
const ignore = require("gulp-ignore");

const testFiles = ["*.spec.tsx", "*.spec.ts"];

gulp.task("es6", ["lint"], () => {
  const tsProject = ts.createProject("tsconfig.json", {
    declaration: true,
    target: "es6",
    module: "es6",
  });
  const tsResult = tsProject.src()
    .pipe(ignore.exclude(testFiles))
    .pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("dist/typings")),
    tsResult.js.pipe(gulp.dest("dist/es6")),
  ]);
});

gulp.task("esm", ["lint"], () => {
  const tsProject = ts.createProject("tsconfig.json", {
    declaration: true,
    target: "es5",
    module: "es6",
  });
  const tsResult = tsProject.src()
    .pipe(ignore.exclude(testFiles))
    .pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("dist/typings")),
    tsResult.js.pipe(gulp.dest("dist/esm")),
  ]);
});

gulp.task("commonjs", ["lint"], () => {
  const tsProject = ts.createProject("tsconfig.json", {
    declaration: true,
    target: "es5",
    module: "commonjs",
  });
  const tsResult = tsProject.src()
    .pipe(ignore.exclude(testFiles))
    .pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("dist/typings")),
    tsResult.js.pipe(gulp.dest("dist/commonjs")),
  ]);
});

gulp.task("tslint", () => {
  return gulp.src("./src/**/*.ts")
    .pipe(tslint({
      formatter: "verbose",
    }))
  .pipe(tslint.report());
});

gulp.task("eslint", () => {
  return gulp.src("./*.js", { dot: true })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("jsonlint", () => {
  return gulp.src([
    "./*.json",
    "./test/**/*.json",
    "./src/**/*.json",
  ], { dot: true })
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task("yamllint", () => {
  return gulp.src("./*.yml", { dot: true })
    .pipe(yamllint());
});

gulp.task("lint", ["jsonlint", "eslint", "tslint", "yamllint"]);
gulp.task("default", ["lint", "commonjs", "esm", "es6"]);
