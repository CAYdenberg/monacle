const React = require('react');

const Account = require(process.env.ROOT+'/components/Nav/Account');
const Folders = require(process.env.ROOT+'/components/Nav/Folders');

module.exports = React.createClass({
  render: function() {
    <div>
      <div id="main-nav" className="navmenu navmenu-inverse navmenu-fixed-left offcanvas-xs main-nav" role="navigation">
        <div className="nav navmenu-nav">

          <div className="close-wrapper">
            <button type="button" className="btn btn-info btn-close" data-toggle="offcanvas" data-target="#main-nav">
              Close
            </button>
          </div>

          <Account />

          <form role="search" method="GET" action="/search">
            <div className="form-group">
              <input type="text" className="form-control" name="query" placeholder="Search" />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-success"><span className="icon-pubmed"></span></button>
            </div>
          </form>

          <Folders />

        </div>

        <footer className="navbar-footer">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="/about/">About Monocle</a></li>
            <li><a href="https://github.com/CAYdenberg/monocle"><span className="icon-github"></span> GitHub</a></li>
          </ul>
        </footer>
      </div>

      <div id="mobile-nav" className="navmenu navmenu-inverse navmenu-fixed-left visible-xs mobile-nav" data-toggle="offcanvas" data-target="#main-nav">
        <button type="button" className="navbar-toggle">
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </div>
    </div>
  }
});
