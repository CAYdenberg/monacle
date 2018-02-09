const popsicle = require('popsicle')
const update = require('immutability-helper')
const {takeEvery, put} = require('redux-saga/effects')

const constants = {
  NEW_SEARCH: 'CITATIONS/NEW_SEARCH',
  REQUEST_CITATIONS: 'CITATIONS/REQUEST_CITATIONS',
  ADD_CITATIONS: 'CITATIONS/ADD_CITATIONS',
  ADD_CITATION_INFO: 'CITATIONS/ADD_CITATION_INFO',
  SET_CURRENT: 'CITATIONS/SET_CURRENT',
  NO_RESPONSE: 'CITATIONS/NO_RESPONSE',
}
const c = constants

const actions = {
  newSearch: function(query) {
    return {type: c.NEW_SEARCH, query}
  },

  requestCitations: function() {
    return {type: c.REQUEST_CITATIONS}
  },

  loadMore: function(query, page = 0) {

    const respond = function(res) {
      if (res.status === 200) {
        const data = JSON.parse(res.body)
        return {
          type: c.ADD_CITATIONS,
          count: data.count,
          add: data.papers,
        }
      }
    }

    return function(dispatch) {
      dispatch(actions.requestCitations())
      return popsicle.request({
        method: 'GET',
        url: '/api/pubmed/' + query,
        query: {page: page},
      }).then(res => dispatch(respond(res)))
    }

  },


  getAbstract: function(pmid) {

    const respond = function(res) {
      if (res.status === 200) {
        return {
          type: c.ADD_CITATION_INFO,
          pmid: pmid,
          changes: {abstract: res.body},
        }
      }
    }

    return function(dispatch) {
      return popsicle.request({
        method: 'GET',
        url: '/api/pubmed/abstract/' + pmid,
      }).then(res => dispatch(respond(res)))
    }

  },

  getOaLocations: function(pmid, doi) {

    const respond = function(res) {
      const data = JSON.parse(res.body)
      if (res.status === 200) {
        return {
          type: c.ADD_CITATION_INFO,
          pmid,
          changes: {oaLocations: data.oa_locations},
        }
      } else {
        return {type: c.NO_RESPONSE}
      }
    }

    return function(dispatch) {
      return popsicle.request({
        method: 'GET',
        url: `https://api.oadoi.org/v2/${doi}?email=ydenberg@gmail.com`,
      }).then(res => dispatch(respond(res)))
    }

  },

  setCurrent: function(pmid) {
    return {type: c.SET_CURRENT, pmid}
  },

  open: function(pmid) {
    return function(dispatch, getState) {
      dispatch(actions.setCurrent(pmid))
      const requestedItem = getState().citations.items.find(item =>
        pmid === item.pmid
      ) || null
      if (!requestedItem) return

      const {doi, abstract} = requestedItem
      if (!abstract) {
        dispatch(actions.getAbstract(pmid))
        dispatch(actions.getOaLocations(pmid, doi))
      }
    }
  },
}

const reducer = function(initialState, action) {
  const defaultState = {
    loading: false,
    total: null,
    items: [],
    nextPage: 0,
    current: null,
  }

  const state = update(defaultState, {$merge: initialState})

  switch(action.type) {
    case c.NEW_SEARCH: {
      return defaultState
    }

    case c.REQUEST_CITATIONS: {
      return update(state, {
        loading: {$set: true},
      })
    }

    // append a bunch of papers to the list
    case c.ADD_CITATIONS:
      return update(state, {
        loading: {$set: false},
        total: {$set: action.count},
        items: {$push: action.add},
        nextPage: {$apply: (x) => x + 1},
      })

    // add other info (such as the abstract) to the list
    case c.ADD_CITATION_INFO:
      const items = state.items.map(item => {
        if (item.pmid === action.pmid) {
          return update(item, {$merge: action.changes})
        } else {
          return item
        }
      })
      return update(state, {items: {$set: items}})

    case c.SET_CURRENT:
      return update(state, {current: {$set: action.pmid}})

    default:
      return state
  }
}

const selectors = {
  isCurrent: (state, pmid) => {
    state.citations.current === pmid
  },

  itemData: (state, pmid) =>
    state.citations.items.find(item => pmid === item.pmid) || null,

  isMorePages: state => {
    return state.citations.total > state.citations.items.length
  },
}

function* newSearchSaga(action) {
  yield put(actions.loadMore(action.query))
  return action
}

function* sagas() {
  yield takeEvery(c.NEW_SEARCH, newSearchSaga)
  return
}

module.exports = {
  constants,
  actions,
  reducer,
  selectors,
  sagas,
}
