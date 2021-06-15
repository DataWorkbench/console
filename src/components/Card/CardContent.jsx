import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const CardContent = ({ className, ...others }) => {
  return <div className={clsx('px-5 pb-5', className)} {...others} />
}
CardContent.propTypes = {
  className: PropTypes.string,
}

export default CardContent
