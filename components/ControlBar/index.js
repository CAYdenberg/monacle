const React = require('react')
const PropTypes = require('prop-types')
const {connect} = require('react-redux')

const {newSearch} = require('../../store/citations').actions

const mapStateToProps = state => {
  const currentQuery = state.searches.current
  return {
    query: currentQuery,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: query => dispatch(newSearch(query)),
  }
}

class ControlBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.query,
    }

    this._onChange = this._onChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  _onChange(e) {
    this.setState({
      value: e.target.value,
    })
  }

  _onSubmit(e) {
    e.preventDefault()
    this.props.submit(this.state.value)
  }

  render() {
    return (
      <nav id="main-nav" className="main-nav" role="navigation">
        <div className="container-fluid">

          <form role="search" method="GET" action="/search" className="form-inline navbar-form navbar-left" onSubmit={this._onSubmit}>
            <div className="form-group">
              <label htmlFor="query" className="sr-only">Search</label>
              <input type="text" className="form-control" name="query" id="query" placeholder="Search" value={this.state.value} onChange={this._onChange} />
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
}

ControlBar.propTypes = {
  query: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ControlBar)
