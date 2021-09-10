import React from 'react'
import PropTypes from 'prop-types'
import tw from 'twin.macro'

const Card = React.forwardRef((props, ref) => {
  const { className, ...others } = props
  return (
    <div
      ref={ref}
      className={className}
      css={[tw`rounded-sm bg-white shadow mb-5`]}
      {...others}
    />
  )
})

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Card
