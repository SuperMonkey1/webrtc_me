const path = require('path');
const App = require('./app');

// Ensure we're in the correct directory
process.chdir(__dirname);

new App().start();