import React from 'react'
import tw from 'twin.macro'
import PropTypes from 'prop-types'

const CardHeader = ({ className, title, subtitle, classes, ...other }) => {
  return (
    <div css={[tw`tw-pt-5 tw-pb-3`, className]} {...other}>
      <div tw="tw-text-base tw-font-semibold tw-text-neut-16 tw-flex tw-items-center">
        <div tw="tw-h-4 tw-w-1 tw-bg-neut-16" />
        <p css={[tw`tw-pl-5`, className]}>{title}</p>
      </div>
      <div tw="tw-text-xs tw-mt-1 tw-text-neut-8 tw-pl-5">
        <p css={classes.subtitle}>{subtitle}</p>
      </div>
    </div>
  )
}

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
