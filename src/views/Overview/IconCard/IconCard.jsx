import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const IconCard = ({ icon, title, subtitle, className }) => {
  return (
    <div className={className}>
      <div className="bg-neutral-N-1 cursor-pointer flex items-center px-3 py-3 rounded-sm border border-neutral-N-2 group hover:border-brand-G4 hover:bg-brand-G0 transition-colors duration-300">
        <div className="w-10 h-10 flex items-center justify-center mr-3  bg-gradient-to-tr from-neutral-N-15 to-neutral-N-10 shadow-md group-hover:from-brand-G11 group-hover:to-brand-G3">
          <Icon name={icon} type="light" size={28} />
        </div>
        <div className="flex-1">
          <div className="font-medium text-neutral-N-15">{title}</div>
          <div className="text-neutral-N-8">{subtitle}</div>
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
