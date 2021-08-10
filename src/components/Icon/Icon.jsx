import React from 'react'
import PropTypes from 'prop-types'

require('assets/icons/icon_service_0.svg')
require('assets/icons/icon_service_1.svg')
require('assets/icons/icon_service_2.svg')
require('assets/icons/icon_service_3.svg')
require('assets/icons/icon_service_4.svg')
require('assets/icons/icon_service_5.svg')
require('assets/icons/screen_failed.svg')
require('assets/icons/screen_running.svg')
require('assets/icons/screen_stoped.svg')
require('assets/icons/screen_success.svg')
require('assets/icons/screen_waiting.svg')

const Icon = (props) => {
  const { name, className, size, ...others } = props
  const wh = {
    width: size,
    height: size,
  }

  return (
    <svg {...wh} {...others} className={className}>
      <use xlinkHref={`#bdicon-${name}`} />
    </svg>
  )
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.number,
}

Icon.defaultProps = {
  className: '',
  size: 24,
}

export default Icon
