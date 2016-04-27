const React = require('react');

//subcomponents
const CitationDetails = require('./CitationDetails');

/**
 * Rendered at #single-citation BY the Citation component.
 * This components is RE-MOUNTED each time an item in the accordion is clicked.
 * It has direct access to the citation store, where it grabs data for a particular
 * citation, based on its pmid property.
 */
const SingleCitation = React.createClass({

  render: function() {
    if (this.props.data) {

      return (
        <div>
          <h5><span className="year">{this.props.data.year}</span></h5>
          <h4>{this.props.data.pubmedSummary.title}</h4>
          <h5 className="author-list">{this.props.data.authorStr}</h5>
          <CitationDetails data={this.props.data} folderStore={this.props.folderStore} />
        </div>
      )

    } else {

      return (
        <div />
      );

    }
  }
});

module.exports = SingleCitation;
