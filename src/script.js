require('regenerator-runtime/runtime')

const React = require('react')
const ReactDOM = require('react-dom')
const {Provider} = require('react-redux')
const {newSearch} = require('../store/citations').actions

const App = require('../components')
const store = require('../store')


window.store = store

if (window.appData.query) {
  const query = window.appData.query
  store.dispatch(newSearch(query))

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
  , document.getElementById('react-entry'))
}
