const {createStore, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
const React = require('react');
const ReactDOM = require('react-dom');

const {reducer} = require('../store');
const {search} = require('../store/citations').actions

const store = createStore(reducer, {}, applyMiddleware(thunk));

const Citations = require('../components/Citations');

if (window.appData.query) {
  const query = window.appData.query;
  store.dispatch(search(query));
  ReactDOM.render(<Citations store={store} />, document.getElementById('react-entry'));
}
