import React from 'react'
import PropTypes from 'prop-types'

function TabPanel({ children }) {
  return <div>{children}</div>
}

TabPanel.propTypes = {
  children: PropTypes.node,
}

export default TabPanel
