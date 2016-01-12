var React = require('react');

var utils = require('../utils');
var dispatcher = utils.dispatcher;

//store references
var folderStore = null;

/**
* Menu of folders to save citation to. Triggers save method in folder store (via the Dispatcher)
*
* NOTE: This component is smart with respect to folders (imports the data directly from the store)
* but dumb with respect to citations (passed the data from SingleCitation or CitationList/Citation).
*/
var CitationControls = React.createClass({

  getInitialState: function() {
    folderStore = this.props.folderStore;
    return ({
      folders: folderStore.folders,
      currentFolder: folderStore.currentFolder
    });
  },

  componentWillMount: function() {
    folderStore.onUpdate(function() {
      this.setState({
        folders: folderStore.folders,
        currentFolder: folderStore.currentFolder
      });
    }.bind(this));
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

var MoveMenu = React.createClass({
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

var SaveMenu = React.createClass({
  saveCitation: function(e) {
    var targetFolder = e.target.value;
    dispatcher.dispatch({
      type: 'SAVE_CITATION',
      content: {
        folder: targetFolder,
        data: this.props.data
      }
    });
  },
  render: function() {
    return (
      <div className="margin-vertical">
        <label htmlFor="save-to-folder">Save to:</label>
        <select id="save-to-folder" className="form-control" onChange={this.saveCitation} value="">
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
