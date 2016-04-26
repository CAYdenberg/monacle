const React = require('react');

const utils = require('../../lib');
const dispatcher = utils.dispatcher;

const CitationList = require('./CitationList');
// const SingleCitation = require('./SingleCitation');

const Citations = React.createClass({

  store: null,
  folderStore: null,

  getInitialState: function() {
    this.store = this.props.store;
    this.folderStore = this.props.folderStore;
    console.log(this);
    return ({
      items: this.store.items,
      currentItem: null,
      totalItems: this.store.total
    });
  },

  componentDidMount: function() {
    this.store.onUpdate(() => {
      this.setState({
        items: this.store.items,
        //the number of results remaining:
        totalItems: this.store.total
      });
    });
  },

  openCitation: function(pmid) {
    this.setState({
      currentItem: this.store.getItem(pmid)
    });
  },

  render: function() {
    // <div data-todo="render single citation here" />
    // openCitation={this.openCitation}
    return (
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <CitationList
            items={this.state.items}
            currentItem={this.state.currentItem}
            totalItems={this.state.totalItems}
            openCitation={this.openCitation}
            folderStore={this.folderStore}
          />
        </div>
        <div className="col-md-6">
        </div>
      </div>
    );
  }

});

//NOTE: the action which triggers this method also opens the accordion
// toggleDetails : function(e) {
//   e.preventDefault();
//   //kill and then re-render the single citation area
//   if (!this.props.data.abstract) {
//     //... then lets go get it
//     dispatcher.dispatch({
//       type: 'GET_DETAILS',
//       content: {pmid: this.props.data.pmid}
//     });
//   }
// },
// componentWillMount : function() {
//   store.onUpdate(function() {
//     this.setState({loading: false});
//   }.bind(this));
// },
// loadMore : function(e) {
//   e.preventDefault();
//   if (this.props.nMore > 0) {
//     this.setState({loading: true});
//     dispatcher.dispatch({
//       type: 'LOAD_MORE',
//       content: {queryString: window.globals.query}
//     });
//   }
// },
// getInitialState : function() {
//   return {
//     loading : true
//   }
// },

module.exports = Citations;
