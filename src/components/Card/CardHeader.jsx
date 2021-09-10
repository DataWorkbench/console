import React from 'react'
import tw from 'twin.macro'
import PropTypes from 'prop-types'

const CardHeader = ({ className, title, subtitle, classes, ...other }) => {
  return (
    <div css={[tw`pt-5 pb-3`, className]} {...other}>
      <div tw="text-base font-semibold text-neut-16 flex items-center">
        <div tw="h-4 w-1 bg-neut-16" />
        <p css={[tw`pl-5`, className]}>{title}</p>
      </div>
      <div tw="text-xs mt-1 text-neut-8 pl-5">
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
