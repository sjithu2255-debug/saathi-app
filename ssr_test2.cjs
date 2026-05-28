require('@babel/register')({
  presets: ['@babel/preset-env', ['@babel/preset-react', {runtime: 'automatic'}]]
});
const React = require('react');
const ReactDOMServer = require('react-dom/server');

global.window = { crypto: { subtle: {} }, location: {}, URL: { createObjectURL: () => '', revokeObjectURL: () => '' } };
global.document = { createElement: () => ({ click: () => {} }) };
global.navigator = { geolocation: {} };
global.localStorage = { getItem: () => null, setItem: () => {} };

try {
  const AppExports = require('./src/App.jsx');
  // Unfortunately AuthScreen is not exported. Let's find AuthScreen in the source and make it exported, 
  // or we can test the whole app but with `showSplash` default false.
  // We'll read the file, modify it in memory, and evaluate it!
} catch (e) {
  console.error(e);
}
