const context = require.context("./src", true, /\.tsx?$/);
context.keys().forEach(context);
