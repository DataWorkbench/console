import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const IconCard = ({ icon, title, subtitle, className }) => {
  return (
    <div className={className}>
      <div className="tw-bg-neutral-N1 tw-cursor-pointer tw-flex tw-items-center tw-px-3 tw-py-3 tw-rounded-sm tw-border tw-border-neutral-N2 tw-group hover:tw-border-brand-G4 hover:tw-bg-brand-G0 tw-transition-colors tw-duration-300">
        <div className="tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-mr-3  tw-bg-gradient-to-tr tw-from-neutral-N15 tw-to-neutral-N10 tw-shadow-md group-hover:tw-from-brand-G11 group-hover:tw-to-brand-G3">
          <Icon name={icon} type="light" size={28} />
        </div>
        <div className="flex-1">
          <div className="tw-font-medium tw-text-neutral-N15">{title}</div>
          <div className="tw-text-neutral-N8">{subtitle}</div>
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
