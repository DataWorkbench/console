import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
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
    <div className="tw-w-14">
      <animated.div
        onMouseEnter={() => {
          toggleOpen(true)
          return false
        }}
        onMouseLeave={() => toggleOpen(false)}
        style={props}
        className={clsx(
          'tw-absolute tw-z-20 tw-h-[300px] tw-opacity-0',
          placement === 'top' && 'tw-top-[-54px] tw-left-[-68px] tw-w-48',
          placement === 'bottom' &&
            'tw-top-[-150px] tw-left-[-60px] 2xl:tw-left-[-68px] tw-w-48',
          placement === 'right' && 'tw-top-[-80px] tw-left-[0px] tw-w-full',
          isOpened ? 'tw-cursor-text' : 'tw-cursor-pointer'
        )}
      >
        <ItemCard item={item} />
      </animated.div>
      <div className={clsx(!open && 'tw-relative tw-z-10')}>
        <Icon name={item.xlink} size={56} className="tw-pointer-events-none" />
        <div className="tw-pt-3">{item.text}</div>
      </div>
    </div>
  )
}

FlowCell.propTypes = {
  item: PropTypes.object,
  placement: PropTypes.oneOf(['top', 'bottom', 'right']),
}

export default FlowCell