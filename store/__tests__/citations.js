/* eslint-env jest */

const {constants, reducer} = require('../citations');
const c = constants

const initialState = {
  items: [
    {pmid: 11111, title: 'Citation One'},
    {pmid: 22222, title: 'Citation Two'},
    {pmid: 33333, title: 'Citation Three'}
  ]
};

it('should add citations to the store', function() {
  const nextState = reducer(initialState, {
    type: c.ADD_CITATIONS,
    count: 4,
    add: [
      {title: 'Citation Four'}
    ]
  });
  expect(nextState.total).toEqual(4)
  expect(nextState.items[3].title).toEqual('Citation Four');
  expect(nextState.nextPage).toEqual(1)
});

it('should be able to add data to a citation', function() {
  const nextState = reducer(initialState, {
    type: c.ADD_CITATION_INFO,
    pmid: 22222,
    changes: {abstract: 'Second citation abstract'}
  });
  expect(nextState.items[1].abstract).toEqual('Second citation abstract');
});
