var React = require('react');

var emitter = require('../utils.js').emitter;
var CitationStore = require('../stores/CitationStore.js');
var Citation = require('./Citation.js');

var store = new CitationStore();

module.exports = React.createClass({
  getInitialState : function() {
    return {
      items : []
    }
  },
  componentDidMount : function() {
    emitter.on('CITATIONS_UPDATED', function() {
      console.log(store);
    });
  },
  render : function() {
    return (
      <div className="items">
        {
          this.state.items.map(function(item) {
            return ( <Citation data={item} key={item.pmid} /> );
          })
        }
      </div>
    );
  }
});
