import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const CardHeader = React.forwardRef((props, ref) => {
  const { className, title, subtitle, classes, ...other } = props
  return (
    <div className={clsx('pt-5 pb-3', className)} {...other} ref={ref}>
      <div className="text-base font-semibold text-neutral-N16 flex items-center">
        <div className="h-4 w-1 bg-neutral-N16" />
        <p className={clsx('pl-5', className)}>{title}</p>
      </div>
      <div className="text-xs mt-1 text-neutral-N8 pl-5">
        <p className={classes.subtitle}>{subtitle}</p>
      </div>
    </div>
  )
})

CardHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
}

CardHeader.defaultProps = {
  classes: {},
}

export default CardHeader
