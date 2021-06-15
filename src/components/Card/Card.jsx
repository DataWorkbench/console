import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const Card = React.forwardRef((props, ref) => {
  const { className, ...others } = props
  return (
    <div
      ref={ref}
      className={clsx('rounded-sm bg-white shadow mb-5', className)}
      {...others}
    />
  )
})

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Card
