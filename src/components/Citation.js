var _ = require('underscore');
var React = require('react');
var CitationDetails = require('./CitationDetails');

var utils = require('../utils.js'),
  dispatcher = utils.dispatcher;
  emitter = utils.emitter;

module.exports = React.createClass({

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

  toggleDetails : function() {
    if ( !this.props.data.abstract ) {
      //... then lets go get it
      dispatcher.dispatch({ type : 'GET_DETAILS', content : {pmid : this.props.data.pubmed} });
    }
  },

  render: function() {
    var headingId = "heading-PMID" + this.props.data.pubmed;
    var collapseId = "collapse-PMID" + this.props.data.pubmed;
    return (
      <div className="panel panel-default">
        <div className="panel-heading" id={headingId}>
          <h4>
            <a onClick={this.toggleDetails} data-toggle="collapse" data-parent="#accordion" data-target={"#" + collapseId}>
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
