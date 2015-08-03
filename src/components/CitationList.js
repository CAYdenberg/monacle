var React = require('react');
var utils = require('../utils.js');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

var CitationStore = require('../stores/CitationStore.js');
var Citation = require('./Citation.js');
var LoadMoreButton = require('./LoadMoreButton.js');

var store = new CitationStore();

module.exports = React.createClass({
  getInitialState : function() {
    return {
      items : [],
      nMore : 0
    }
  },
  componentWillMount : function() {
    emitter.on('CITATIONS_UPDATED', function() {
      this.setState({
        items : store.items,
        nMore : (store.total - store.items.length)
      });
    }.bind(this));
  },
  render : function() {
    return (
      <div className="panel-group" id="accordion">
        {
          this.state.items.map(function(item) {
            return ( <Citation data={item} key={item.uid} /> );
          })
        }
        <LoadMoreButton nMore={this.state.nMore} />
      </div>
    );
  }
});
