const {createStore, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;

const {actions, reducer} = require('../store');

const store = createStore(reducer, {}, applyMiddleware(thunk));

store.subscribe(() => {
  console.log(store.getState());
})


if (window.appData.query) {
  const query = window.appData.query;
  console.log(query);
  store.dispatch(actions.search(window.appData.query));
}
