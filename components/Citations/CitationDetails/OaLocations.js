const React = require('react')
const PropTypes = require('prop-types')

const OaLocations = props => {
  if (props.locations && props.locations.length) {
    return (
      <div className="oa-locations">
        <h5 className="oa-location__title">Open-access locations (oadoi.org)</h5>
        <ul className="oa-location__item">
          {props.locations.map(location =>
            <li key={location.url}><a href={location.url}>{location.url}</a></li>
          )}
        </ul>
      </div>
    )
  }
  return (
    <div />
  )
}

OaLocations.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired
  }))
}

module.exports = OaLocations
