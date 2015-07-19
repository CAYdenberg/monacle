var React = require('react');
var utils = require('../utils.js');
var emitter = utils.emitter;

var CitationStore = require('../stores/CitationStore.js');
var Citation = require('./Citation.js');

var store = new CitationStore();

module.exports = React.createClass({
  getInitialState : function() {
    return {
      items : []
    }
  },
  componentWillMount : function() {
    emitter.on('CITATIONS_UPDATED', function() {
      this.setState({ items : store.data });
    }.bind(this));
  },
  render : function() {
    return (
      <div className="items">
        {
          this.state.items.map(function(item) {
            return ( <Citation data={item} key={item.uid} /> );
          })
        }
      </div>
    );
  }
});
