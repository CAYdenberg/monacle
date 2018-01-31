var React = require('react');

const ErrorMsg = props => {
  if (props.message) {
    return (
      <div className={"alert alert-"+props.type}>{props.message}</div>
    )
  } else {
    return <div />;
    }
}

module.exports = ErrorMsg;
