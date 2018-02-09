const update = require('immutability-helper')
const {NEW_SEARCH} = require('./citations').constants

const reducer = (initialState, action) => {
  initialState = initialState || {
    current: '',
  }

  switch(action.type) {
    case NEW_SEARCH: {
      return update(initialState, {current: {$set: action.query}})
    }

    default: {
      return initialState
    }
  }
}

module.exports = {
  reducer,
}
