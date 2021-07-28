import React from 'react'
import PropTypes from 'prop-types'

function TabPanel({ className, children }) {
  return <div className={className}>{children}</div>
}

TabPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default TabPanel
