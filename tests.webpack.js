"use strict";

const srcContext = require.context("./src", true, /^(?!.*\.spec\.).*\.tsx?$/);
srcContext.keys().forEach(srcContext);

const testContext = require.context("./test", true, /\.tsx?$/);
testContext.keys().forEach(testContext);
