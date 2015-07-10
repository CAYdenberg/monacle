var React = require('react');

var Citations = React.createClass({
  getInitialState : function() {
    return {
      items : [
        { pmid : "12345", title : "Fus2", author : "ydenberg ca" },
        { pmid : "67890", title : "Gmf1", author : "goode bl" }
      ]
    }
  },
  render : function() {
    return (
      <div className="items">
        {
          this.state.items.map(function(item) {
            return ( <Citation data={item} key={item.pmid} /> );
          })
        }
      </div>
    );
  }
});

var Citation = React.createClass({
  render: function() {
    return (
      <div className="item">
        <h3>{this.props.data.title}</h3>
        <h5>{this.props.data.author}</h5>
      </div>
    )
  }
});

module.exports = {
  Citations : Citations,
  Citation : Citation
}
