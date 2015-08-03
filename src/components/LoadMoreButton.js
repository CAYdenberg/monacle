var React = require('react');

var utils = require('../utils.js'),
  dispatcher = utils.dispatcher;
  emitter = utils.emitter;

module.exports = React.createClass({
  getInitialState : function() {
    return {
      loading : false
    }
  },
  componentWillMount : function() {
    emitter.on('CITATIONS_UPDATED', function() {
      this.setState({ loading : false });
    }.bind(this));
  },
  loadMore : function(e) {
    console.log(this.props);
    e.preventDefault();
    if ( this.props.nMore > 0 ) {
      this.setState({ loading : true });
      dispatcher.dispatch({ type : 'LOAD_MORE', content : { queryString : utils.getParameterByName('query') } });
    }
  },
  render : function() {
    if ( this.state.loading ) {
      return (
        <div className="progressBar">Progress bar</div>
      );
    } else if ( ! this.props.nMore ) {
      return (
        <a href="#" disabled>End of results</a>
      )
    } else {
      return (
        <a href="#" onClick={this.loadMore}>Load more ...</a>
      );
    }
  }
});
