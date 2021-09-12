/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'

function TabPanel({ className, children }) {
  return <div className={className}>{children}</div>
}

TabPanel.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default TabPanel
