var React = require('react');
var _ = require('underscore');

var utils = require('../utils.js');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;


module.exports = function(store) {

  var CitationDetails = React.createClass({
    render: function() {
      if ( _.isNull(this.props.data.abstract) ) {
        return (
          <ProgressBar />
        )
      } else {
        return (
          <div className="citation-details">
            <h5><span className="year">{utils.formatYear(this.props.data.pubdate)}</span></h5>
            <h4>{this.props.data.title}</h4>
            <h5 className="author-list">{utils.formatAuthorList(this.props.data.authors)}</h5>
            <div className="abstract">{this.props.data.abstract}</div>
            <LensLink link={this.props.data.pmc} />
          </div>
        )
      }
    }
  });

  var ProgressBar = require('./ProgressBar.js')();

  var LensLink = React.createClass({
    render: function() {
      if ( this.props.link ) {
        return (
          <div className="margin-vertical">
            <a href={"/lens/" + this.props.link} target="_blank" className="btn btn-primary">
              <span className="icon-lens"></span> View in Lens
            </a>
          </div>
        )
      } else {
        return (
          <div></div>
        )
      }
    }
  });

  return CitationDetails;
}
