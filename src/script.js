
const React = require('react')
const ReactDOM = require('react-dom')
const {Provider} = require('react-redux')
const {search} = require('../store/citations').actions

const App = require('../components')
const store = require('../store')

if (window.appData.query) {
  const query = window.appData.query
  store.dispatch(search(query))

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
  , document.getElementById('react-entry'))
}
