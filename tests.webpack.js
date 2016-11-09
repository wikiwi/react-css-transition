const integrationContext = require.context("./test", true, /\.tsx?$/);
integrationContext.keys().forEach(integrationContext);
