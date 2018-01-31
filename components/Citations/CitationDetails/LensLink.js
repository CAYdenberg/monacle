var React = require('react');

/**
 * Link to the Lens representation of article.
 * Displayed ONLY if there is a PMC identifier (best way we have right now of
telling if article is open access)
 */
module.exports = props => {
  if (props.link) {
    return (
      <div className="margin-vertical">
        <a href={"/lens/" + props.link} target="_blank" className="btn btn-success">
          <span className="icon-lens"></span> View in Lens
        </a>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}
