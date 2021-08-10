import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const IconCard = ({ icon, title, subtitle, className, layout }) => {
  return (
    <div
      className={clsx(
        'tw-group hover:tw-border-green-4 hover:tw-bg-green-0 tw-transition-colors tw-duration-300',
        'tw-bg-neut-1 tw-cursor-pointer tw-flex tw-items-center  tw-rounded-sm tw-border tw-border-neut-2 ',
        layout === 'vertical'
          ? 'tw-flex-col tw-px-8 tw-py-2'
          : 'tw-py-3 tw-px-3',
        className
      )}
    >
      <div
        className={clsx(
          'group-hover:tw-from-green-11 group-hover:tw-to-green-3',
          'tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center  tw-bg-gradient-to-tr tw-from-neut-15 tw-to-neut-10 tw-shadow-md',
          layout !== 'vertical' && 'tw-mr-3'
        )}
      >
        <Icon name={icon} type="light" size={28} />
      </div>
      <div className="flex-1">
        <div
          className={clsx(
            'tw-text-neut-15',
            layout === 'vertical' ? 'tw-pt-1' : 'tw-font-medium'
          )}
        >
          {title}
        </div>
        {subtitle && <div className="tw-text-neut-8">{subtitle}</div>}
      </div>
    </div>
  )
}

IconCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  layout: PropTypes.oneOf(['vertical', 'horizon']),
}

export default IconCard
