const React = require('react');

const utils = require('../lib');
const dispatcher = utils.dispatcher;
const createTypingCallback = utils.createTypingCallback;

// var store = null;
// var userStore = null;

const Folders = React.createClass({

  userStore: null,
  store: null,

  getInitialState: function() {
    this.store = this.props.store;
    this.userStore = this.props.userStore;
    return {
      folders: this.store.folders,
      newFolderName: '',
      loggedIn: this.userStore.userEmail
    }
  },

  componentDidMount: function() {
    this.store.onUpdate(() => {
      this.setState({
        folders: this.store.folders,
        newFolderName: ''
      });
    });
    this.userStore.onUpdate(() => {
      this.setState({
        loggedIn: this.userStore.userEmail
      });
    });
  },

  add: function(e) {
    e.preventDefault();
    dispatcher.dispatch({
      type: 'ADD_FOLDER',
      content: {name : this.state.newFolderName}
    });
  },

  render: function() {
    if (this.state.loggedIn) {
      return (
        <div>
          <ul className="folder-list">
            {
              this.state.folders.map(function(folder) {
                return (<Folder data={folder} key={folder.slug} />)
              })
            }
          </ul>
          <form className="form-inline" method="POST" onSubmit={this.add}>
            <div className="form-group">
              <input type="text" className="form-control new-folder-input" value={this.state.newFolderName} onChange={createTypingCallback('newFolderName', this)} />
              <button type="submit" className="btn-new-folder">+</button>
            </div>
          </form>
        </div>
      )
    } else {
      return (<div />);
    }
  }
});

const Folder = React.createClass({
  render: function() {
    return (
      <li><a href={'/library/'+this.props.data.slug+'/'}>{this.props.data.name}</a></li>
    )
  }
});

module.exports = Folders;
