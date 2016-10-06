var React = require('react');

var utils = require('../../lib');
var dispatcher = utils.dispatcher;

//store references

/**
* Menu of folders to save citation to. Triggers save method in folder store (via the Dispatcher)
*
* NOTE: This component is smart with respect to folders (imports the data directly from the store)
* but dumb with respect to citations (passed the data from SingleCitation or CitationList/Citation).
*/
var CitationControls = React.createClass({
  store: null,

  getInitialState: function() {
    this.store = this.props.folderStore;
    return ({
      folders: this.store.folders,
      currentFolder: this.store.currentFolder
    });
  },

  componentWillMount: function() {
    this.store.onUpdate(() => {
      this.setState({
        folders: this.tore.folders,
        currentFolder: this.store.currentFolder
      });
    });
  },

  render: function() {
    if (this.state.currentFolder) {
      return (
        <MoveMenu data={this.props.data} currentFolder={this.state.currentFolder} folders={this.state.folders} />
      )
    } else if (this.state.folders.length) {
      return (
        <SaveMenu data={this.props.data} folders={this.state.folders} />
      )
    } else {
      return (
        <div />
      )
    }

  }
});

const MoveMenu = React.createClass({
  saveCitation: function(e) {
    var newFolder = e.target.value;
    var oldFolder = this.props.currentFolder;
    dispatcher.dispatch({
      type: 'MOVE_CITATION',
      content: {
        newFolder: newFolder,
        oldFolder: oldFolder,
        data: this.props.data
      }
    });
  },
  render: function() {
    return (
      <div className="margin-vertical">
        <label htmlFor="save-to-folder">Move to:</label>
        <select id="save-to-folder" className="form-control" onChange={this.saveCitation} value={this.props.currentFolder}>
          <option value=""></option>
          {
            this.props.folders.map(function(item) {
              return (<SaveOption item={item} key={item.slug} />)
            })
          }
        </select>
      </div>
    )
  }
});

const SaveMenu = React.createClass({
  getInitialState: function() {
    return ({
      currentFolder: ''
    });
  },
  saveCitation: function(e) {
    var targetFolder = e.target.value;
    dispatcher.dispatch({
      type: 'SAVE_CITATION',
      content: {
        folder: targetFolder,
        data: this.props.data
      }
    });
    this.setState({
      currentFolder: e.target.value
    });
  },
  render: function() {
    return (
      <div className="margin-vertical">
        <label htmlFor="save-to-folder">Save to:</label>
        <select id="save-to-folder" className="form-control" onChange={this.saveCitation} value={this.state.currentFolder}>
          <option value=""></option>
          {
            this.props.folders.map(function(item) {
              return (<SaveOption item={item} key={item.slug} />)
            })
          }
        </select>
      </div>
    );
  }
})

/**
 * Individual options in the folders list.
 * Rendered by SaveMenu and MoveMenu
 */
var SaveOption = React.createClass({
  render: function() {
    return (
      <option value={this.props.item.slug}>{this.props.item.name}</option>
    )
  }
});

module.exports = CitationControls;
