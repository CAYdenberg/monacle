const React = require('react');

const Nav = require(process.env.ROOT+'/components/Nav');
const Notifications = require(process.env.ROOT+'/components/Notifications');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Notifications />

        <Nav />

        <div className="container-fluid">
          <div className="row">

            <div className="col-sm-12 col-md-6 citation-list" id="citations"></div>

            <div className="col-md-6 single-citation" id="single-citation"></div>

          </div>
        </div>
      </div>
    );
  }
});
