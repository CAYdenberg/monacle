var React = require('react');
var _ = require('underscore');

var utils = require('../utils');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;


module.exports = function(store, folderStore) {

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
            <div className="margin-vertical">
              <a href={"http://www.ncbi.nlm.nih.gov/pubmed/" + this.props.data.pubmed} className="btn btn-info" target="_blank">
                <span className="icon-pubmed"></span> View on PubMed
              </a>
            </div>
            <SaveMenu pmid={this.props.data.pubmed} />
          </div>
        )
      }
    }
  });

  var ProgressBar = require('./partials/ProgressBar.js')();

  var LensLink = React.createClass({
    render: function() {
      if ( this.props.link ) {
        return (
          <div className="margin-vertical">
            <a href={"/lens/" + this.props.link} target="_blank" className="btn btn-success">
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

  var SaveMenu = React.createClass({
    getInitialState: function() {
      return ({
        folders: folderStore.folders
      });
    },
    componentWillMount: function() {
      emitter.on('FOLDERS_UPDATED', function() {
        this.setState({
          folders: folderStore.folders
        });
      }.bind(this));
    },
    saveCitation: function() {
      alert(this.props.pmid);
    },
    render: function() {
      if (this.state.folders.length) {

        return (
          <div className="margin-vertical">
            <label for="save-to-folder">Save to:</label>
            <select id="save-to-folder" className="form-control" onChange={this.saveCitation}>
              <option value=""></option>
              {
                this.state.folders.map(function(item) {
                  return (<SaveOption item={item} key={item.slug} />)
                })
              }
            </select>
          </div>
        )

      } else {
        return (<div />);
      }
    }
  });

  var SaveOption = React.createClass({
    render: function() {
      return (
        <option value={this.props.item.slug}>{this.props.item.name}</option>
      )
    }
  });

  return CitationDetails;
}
