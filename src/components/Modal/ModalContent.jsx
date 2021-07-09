import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.node,
}

function ModalContent({ children }) {
  return <div className="tw-pt-4 tw-px-5">{children}</div>
}

ModalContent.propTypes = propTypes

export default ModalContent
