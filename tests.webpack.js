const unitContext = require.context("./src", true, /\.tsx?$/);
unitContext.keys().forEach(unitContext);

const integrationContext = require.context("./test", true, /\.tsx?$/);
integrationContext.keys().forEach(integrationContext);
