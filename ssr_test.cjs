require('@babel/register')({
  presets: ['@babel/preset-env', ['@babel/preset-react', {runtime: 'automatic'}]]
});
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// stub browser globals
global.window = { crypto: { subtle: {} }, location: {}, URL: { createObjectURL: () => '', revokeObjectURL: () => '' } };
global.document = { createElement: () => ({ click: () => {} }) };
global.navigator = { geolocation: {} };
global.localStorage = { getItem: () => null, setItem: () => {} };

try {
  const App = require('./src/App.jsx').default;
  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log('RENDER SUCCESS');
  console.log(html.substring(0, 100));
} catch (e) {
  console.error('RENDER ERROR:', e);
}
