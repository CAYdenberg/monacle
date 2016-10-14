/* eslint-env mocha */

const assert = require('assert');

const reducer = require('../store/reducer');

describe('State reducer', function() {
  const initialState = {
    citations: [
      {pmid: 11111, title: 'Citation One'},
      {pmid: 22222, title: 'Citation Two'},
      {pmid: 33333, title: 'Citation Three'}
    ]
  };

  it('should add citations to the store', function() {
    const nextState = reducer(initialState, {
      type: 'ADD_CITATIONS',
      add: [
        {title: 'Citation Four'}
      ]
    });
    assert.equal(nextState.citations[3].title, 'Citation Four');
  });

  it('should be able to add data to a citation', function() {
    const nextState = reducer(initialState, {
      type: 'ADD_CITATION_INFO',
      pmid: 22222,
      changes: {abstract: 'Second citation abstract'}
    });
    assert.equal(nextState.citations[1].abstract, 'Second citation abstract');
  });

});
