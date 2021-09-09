import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const IconCard = ({ icon, title, subtitle, className }) => {
  return (
    <div className={className}>
      <div
        className="group"
        tw="tw-bg-neut-1 tw-cursor-pointer tw-flex tw-items-center tw-px-3 tw-py-3 tw-rounded-sm tw-border tw-border-neut-2 hover:tw-border-green-4 hover:tw-bg-green-0 tw-transition-colors tw-duration-300"
      >
        <div tw="tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-mr-3  tw-bg-gradient-to-tr tw-from-neut-15 tw-to-neut-10 tw-shadow-md group-hover:tw-from-green-11 group-hover:tw-to-green-3">
          <Icon name={icon} type="light" size={28} />
        </div>
        <div tw="tw-flex-1">
          <div tw="tw-font-medium tw-text-neut-15">{title}</div>
          <div tw="tw-text-neut-8">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

IconCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string,
}

export default IconCard
