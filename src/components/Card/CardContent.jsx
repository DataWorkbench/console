import React from 'react'
import tw from 'twin.macro'
import PropTypes from 'prop-types'

const CardContent = ({ className, ...others }) => {
  return <div css={[tw`tw-px-5 tw-pb-5`, className]} {...others} />
}
CardContent.propTypes = {
  className: PropTypes.string,
}

export default CardContent
