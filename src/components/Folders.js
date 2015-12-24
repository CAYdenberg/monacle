var React = require('react');

var utils = require('../utils');
var dispatcher = utils.dispatcher;
var createTypingCallback = utils.createTypingCallback;

module.exports = function(store, userStore) {
  var Folders = React.createClass({

    getInitialState : function() {
      return {
        folders: [],
        newFolderName: '',
        loggedIn: userStore.loggedIn
      }
    },

    componentWillMount : function() {
      store.onUpdate(function() {
        this.setState({
          folders: store.folders
        });
      }.bind(this));
      userStore.onUpdate(function() {
        this.setState({
          loggedIn: userStore.loggedIn
        });
      }.bind(this));
    },

    add : function(e) {
      e.preventDefault();
      dispatcher.dispatch({ type : 'ADD_FOLDER', content : {name : this.state.newFolderName} });
    },

    render : function() {
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

  var Folder = React.createClass({
    render : function() {
      return (
        <li><a href={'/library/'+this.props.data.slug+'/'}>{this.props.data.name}</a></li>
      )
    }
  });

  return Folders;
}
