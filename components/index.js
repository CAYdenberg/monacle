const React = require('react')
const ControlBar = require('./ControlBar')
const Citations = require('./Citations')

const App = () => {
  return (
    <div>
      <ControlBar />
      <Citations />
    </div>
  )
}

module.exports = App
