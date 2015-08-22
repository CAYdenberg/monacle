var React = require('react');
var _ = require('underscore');

var utils = require('../utils.js');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

module.exports = function(store) {
  var Folders = React.createClass({
    getInitialState : function() {
      return {
        folders : store.folders,
        newFolderName : ''
      }
    },
    componentWillMount : function() {
      emitter.on('FOLDERS_UPDATED', function() {
        this.setState({
          folders: store.folders
        });
        console.log(this.state);
      }.bind(this));
    },
    typing : function(e) {
      this.setState({ newFolderName : e.target.value });
    },
    add : function(e) {
      e.preventDefault();
      dispatcher.dispatch({ type : 'ADD_FOLDER', content : {name : this.state.newFolderName} });
    },
    render : function() {
      return (
        <div>
          {
            this.state.folders.map(function(item) {
              return (<Folder data={item} key={item.slug} />)
            })
          }
          <form className="form-inline" method="POST" onSubmit={this.add}>
            <div className="form-group">
              <input type="text" className="form-control" value={this.state.newFolderName} onChange={this.typing} />
              <button type="submit">+</button>
            </div>
          </form>
        </div>
      );
    }
  });

  var Folder = React.createClass({
    render : function() {
      return (
        <li><a href="#">{this.props.data.name}</a></li>
      )
    }
  });

  return Folders;
}
