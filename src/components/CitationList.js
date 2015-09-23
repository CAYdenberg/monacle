var React = require('react');
var _ = require('underscore');

var utils = require('../utils');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

module.exports = function(store, folderStore) {

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
    toggleDetails : function(e) {
      e.preventDefault();
      React.unmountComponentAtNode(document.getElementById('single-citation'));
      if ( !this.props.data.abstract ) {
        //... then lets go get it
        dispatcher.dispatch({ type : 'GET_DETAILS', content : {pmid : this.props.data.pubmed} });
      }
      React.render(<SingleCitation data={this.props.data} />, document.getElementById('single-citation'));
    },
    render: function() {
      var headingId = "heading-PMID" + this.props.data.pubmed;
      var collapseId = "collapse-PMID" + this.props.data.pubmed;
      return (
        <div className="panel panel-info">
          <a href="#" onClick={this.toggleDetails} data-toggle="collapse" data-parent="#accordion" data-target={"#" + collapseId}>
            <div className="panel-heading" id={headingId}>
              <h4>
                  {this.props.data.title}
              </h4>
              <h5 className="author-list">
                {utils.formatAuthorList(this.props.data.authors)},
                &nbsp;<span className="year">{utils.formatYear(this.props.data.pubdate)}</span>
              </h5>
            </div>
          </a>
          <div className="panel-collapse collapse" id={collapseId}>
            <div className="panel-body">
              <CitationDetails data={this.props.data} />
            </div>
          </div>
        </div>
      )
    }
  });

  var SingleCitation = require('./SingleCitation.js')(store, folderStore);

  var CitationDetails = require('./CitationDetails.js')(store, folderStore);

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
          <ProgressBar />
        );
      } else if ( ! this.props.nMore ) {
        return (
          <span className="results-end">End of results</span>
        )
      } else {
        return (
          <a href="#" onClick={this.loadMore}>Load more ...</a>
        );
      }
    }
  });

  var ProgressBar = require('./partials/ProgressBar.js')();

  return CitationList;
}
