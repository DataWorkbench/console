import React from 'react'
import PropTypes from 'prop-types'
import tw from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const IconCard = ({ icon, title, subtitle, className, layout }) => {
  return (
    <div
      className={`${className} group`}
      css={[
        tw`hover:(border-green-4 bg-green-0) transition-colors duration-300`,
        tw`bg-neut-1 cursor-pointer flex items-center  rounded-sm border border-neut-2`,
        layout === 'vertical' ? tw`flex-col px-8 py-2` : tw`py-3 px-3`,
      ]}
    >
      <div
        css={[
          tw`group-hover:from-green-11 group-hover:to-green-3`,
          tw`w-10 h-10 flex items-center justify-center  bg-gradient-to-tr from-neut-15 to-neut-10 shadow-md`,
          layout !== 'vertical' && tw`mr-3`,
        ]}
      >
        <Icon name={icon} type="light" size={28} />
      </div>
      <div tw="flex-1">
        <div
          css={[
            tw`text-neut-15`,
            layout === 'vertical' ? tw`pt-1` : tw`font-medium`,
          ]}
        >
          {title}
        </div>
        {subtitle && <div className="text-neut-8">{subtitle}</div>}
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
