const {createStore, applyMiddleware} = require('redux')
const thunk = require('redux-thunk').default
const createSagaMiddleware = require('redux-saga').default
const {spawn} = require('redux-saga/effects')
const {combineReducers} = require('redux')

const citations = require('./citations')

const reducer = combineReducers({citations: citations.reducer})

const sagaMiddleware = createSagaMiddleware()
function* masterSaga() {
  yield spawn(citations.sagas)
  return
}

const store = createStore(reducer, {}, applyMiddleware(thunk, sagaMiddleware))

sagaMiddleware.run(masterSaga)

module.exports = store
