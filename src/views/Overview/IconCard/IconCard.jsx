import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const IconCard = ({ icon, title, subtitle, className }) => {
  return (
    <div className={className}>
      <div
        className="group"
        tw="bg-neut-1 cursor-pointer flex items-center px-3 py-3 rounded-sm border border-neut-2 hover:border-green-4 hover:bg-green-0 transition-colors duration-300"
      >
        <div tw="w-10 h-10 flex items-center justify-center mr-3  bg-gradient-to-tr from-neut-15 to-neut-10 shadow-md group-hover:from-green-11 group-hover:to-green-3">
          <Icon name={icon} type="light" size={28} />
        </div>
        <div tw="flex-1">
          <div tw="font-medium text-neut-15">{title}</div>
          <div tw="text-neut-8">{subtitle}</div>
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
