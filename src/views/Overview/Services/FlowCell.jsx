import React, { useState } from 'react'
import PropTypes from 'prop-types'
import tw from 'twin.macro'
import { useSpring, animated } from 'react-spring'
import Icon from 'components/Icon'
import ItemCard from './ItemCard'

function FlowCell({ item, placement }) {
  const [open, toggleOpen] = useState(false)
  const [isOpened, toggleOpened] = useState(false)

  const props = useSpring({
    opacity: open ? 1 : 0,
    scale: open ? 1 : 0.9,
    delay: open ? 150 : 50,
    onRest: {
      opacity: ({ value }) => {
        if (value === 0) {
          toggleOpened(false)
        }
        if (value === 1) {
          toggleOpened(true)
        }
      },
    },
    config: { duraction: 150 },
  })
  return (
    <div tw="w-14">
      <animated.div
        onMouseEnter={() => {
          toggleOpen(true)
          return false
        }}
        onMouseLeave={() => toggleOpen(false)}
        style={props}
        css={[
          tw`absolute z-20 h-[300px] opacity-0`,
          placement === 'top' && tw`top-[-54px] left-[-68px] w-48`,
          placement === 'bottom' &&
            tw`top-[-150px] left-[-60px] 2xl:left-[-68px] w-48`,
          placement === 'right' && tw`top-[-80px] left-[0px] w-full`,
          isOpened ? tw`cursor-text` : tw`cursor-pointer`,
        ]}
      >
        <ItemCard item={item} />
      </animated.div>
      <div css={!open && tw`relative z-10`}>
        <Icon name={item.xlink} size={56} tw="pointer-events-none" />
        <div tw="pt-3">{item.text}</div>
      </div>
    </div>
  )
}

FlowCell.propTypes = {
  item: PropTypes.object,
  placement: PropTypes.oneOf(['top', 'bottom', 'right']),
}

export default FlowCell
