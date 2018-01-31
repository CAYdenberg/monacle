const {combineReducers} = require('redux')

const citations = require('./citations').reducer

module.exports = {
  reducer: combineReducers({citations})
}
