import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const CardHeader = React.forwardRef((props, ref) => {
  const { className, title, subtitle, classes, ...other } = props
  return (
    <div className={clsx('tw-pt-5 tw-pb-3', className)} {...other} ref={ref}>
      <div className="tw-text-base tw-font-semibold tw-text-neutral-N16 tw-flex tw-items-center">
        <div className="tw-h-4 tw-w-1 tw-bg-neutral-N16" />
        <p className={clsx('tw-pl-5', className)}>{title}</p>
      </div>
      <div className="tw-text-xs tw-mt-1 tw-text-neutral-N8 tw-pl-5">
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
