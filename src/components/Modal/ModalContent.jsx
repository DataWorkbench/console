import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.node,
}

function ModalContent({ children }) {
  return <div tw="pt-4 px-5">{children}</div>
}

ModalContent.propTypes = propTypes

export default ModalContent
