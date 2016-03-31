var React = require('react');

var Base = React.createClass({
  render: function() {
    return (
      <div>
        <div id="alert-area" className="alert-area-wrapper"></div>

        <div id="main-nav" className="navmenu navmenu-inverse navmenu-fixed-left offcanvas-xs main-nav" role="navigation">
          <div className="nav navmenu-nav">

            <div className="close-wrapper">
              <button type="button" className="btn btn-info btn-close" data-toggle="offcanvas" data-target="#main-nav">
                Close
              </button>
            </div>

            <div id="account-area" className="account-area"></div>

            <form role="search" method="GET" action="/search">
              <div className="form-group">
                <input type="text" className="form-control" name="query" placeholder="Search" />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success"><span className="icon-pubmed"></span></button>
              </div>
            </form>

            <div id="folders" className="folders"></div>

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

        <div className="container-fluid">
          <div className="row">

            <div className="col-sm-12 col-md-6 citation-list" id="citations"></div>

            <div className="col-md-6 single-citation" id="single-citation"></div>

          </div>
        </div>

        <div className="modal fade" id="modal-signup-form">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">Sign up now!</h3>
              </div>

              <div className="modal-body" id="signup-form-wrapper"></div>

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" data-toggle="modal" data-target="#modal-signin-form">
                  I already have an account
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modal-signin-form">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">Sign in</h3>
              </div>

              <div className="modal-body" id="signin-form-wrapper"></div>

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" data-toggle="modal" data-target="#modal-signup-form">
                  Create an account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Base;
