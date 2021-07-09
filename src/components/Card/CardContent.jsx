import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const CardContent = ({ className, ...others }) => {
  return <div className={clsx('tw-px-5 tw-pb-5', className)} {...others} />
}
CardContent.propTypes = {
  className: PropTypes.string,
}

export default CardContent
