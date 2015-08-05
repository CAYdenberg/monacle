var React = require('react');
var _ = require('underscore');

var utils = require('../utils.js');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

module.exports = function(store) {

  var CitationList = React.createClass({
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

  var Citation = React.createClass({
    formatAuthorList : function() {
      var authArr,
        authStr = '';
      if (this.props.data.authors) {
        authArr = _.map(this.props.data.authors, function(author) {
          return author.name;
        });
        authStr = authArr.join(', ');
      }
      return authStr;
    },
    toggleDetails : function(e) {
      e.preventDefault();
      if ( !this.props.data.abstract ) {
        //... then lets go get it
        dispatcher.dispatch({ type : 'GET_DETAILS', content : {pmid : this.props.data.pubmed} });
      }
      var details = React.render(<CitationDetails data={this.props.data} />, document.getElementById('paper-details'));
    },
    render: function() {
      var headingId = "heading-PMID" + this.props.data.pubmed;
      var collapseId = "collapse-PMID" + this.props.data.pubmed;
      return (
        <div className="panel panel-default">
          <div className="panel-heading" id={headingId}>
            <h4>
              <a href="#" onClick={this.toggleDetails} data-toggle="collapse" data-parent="#accordion" data-target={"#" + collapseId}>
                {this.props.data.title}
              </a>
            </h4>
            <h5>{this.formatAuthorList()}</h5>
          </div>
          <div className="panel-collapse collapse" id={collapseId}>
            <div className="panel-body">
              <CitationDetails data={this.props.data} />
            </div>
          </div>
        </div>
      )
    }
  });

  var CitationDetails = require('./CitationDetails.js')(store);

  var LoadMoreButton = React.createClass({
    getInitialState : function() {
      return {
        loading : true
      }
    },
    componentWillMount : function() {
      emitter.on('CITATIONS_UPDATED', function() {
        this.setState({ loading : false });
      }.bind(this));
    },
    loadMore : function(e) {
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

  return CitationList;
}
