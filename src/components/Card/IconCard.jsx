import React from 'react'
import PropTypes from 'prop-types'
import tw from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const IconCard = ({ icon, title, subtitle, className, layout }) => {
  return (
    <div
      className={`${className} group`}
      css={[
        tw`hover:(tw-border-green-4 tw-bg-green-0) tw-transition-colors tw-duration-300`,
        tw`tw-bg-neut-1 tw-cursor-pointer tw-flex tw-items-center  tw-rounded-sm tw-border tw-border-neut-2`,
        layout === 'vertical'
          ? tw`tw-flex-col tw-px-8 tw-py-2`
          : tw`tw-py-3 tw-px-3`,
      ]}
    >
      <div
        css={[
          tw`group-hover:tw-from-green-11 group-hover:tw-to-green-3`,
          tw`tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center  tw-bg-gradient-to-tr tw-from-neut-15 tw-to-neut-10 tw-shadow-md`,
          layout !== 'vertical' && tw`tw-mr-3`,
        ]}
      >
        <Icon name={icon} type="light" size={28} />
      </div>
      <div tw="tw-flex-1">
        <div
          css={[
            tw`tw-text-neut-15`,
            layout === 'vertical' ? tw`tw-pt-1` : tw`tw-font-medium`,
          ]}
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
