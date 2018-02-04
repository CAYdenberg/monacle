const React = require('react')
const PropTypes = require('prop-types')

const ControlBar = props => {
  return (
    <nav id="main-nav" className="main-nav" role="navigation">
      <div className="container-fluid">

        <form role="search" method="GET" action="/search" className="form-inline navbar-form navbar-left">
          <div className="form-group">
            <label htmlFor="query" className="sr-only">Search</label>
            <input type="text" className="form-control" name="query" id="query" placeholder="Search" value="{{appData.query}}" />
            <button type="submit" className="btn btn-success hidden-sm hidden-xs"><span className="icon-pubmed"></span></button>
          </div>
        </form>

        <ul className="nav navbar-nav navbar-right hidden-xs">
          <li><a href="/">About</a></li>
          <li><a href="https://github.com/CAYdenberg/monocle"><span className="icon-github"></span></a></li>
        </ul>

      </div>
    </nav>
  )
}

module.exports = ControlBar
