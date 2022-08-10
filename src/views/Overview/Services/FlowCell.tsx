import React from 'react'
import tw from 'twin.macro'
import { motion } from 'framer-motion'
import { Icons } from 'components'
import ItemCard from './ItemCard'

interface FlowCellProps {
  item: {
    xlink: string
    text: string
    [propName: string]: any
  }
  placement?: 'top' | 'bottom' | 'right'
}

const FlowCell: React.FC<FlowCellProps> = ({ item, placement }) => (
  <div tw="w-14">
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      whileHover={{ opacity: 1, scale: 1, transition: { duration: 0.25 } }}
      css={[
        tw`absolute z-20 h-[300px] opacity-100 scale-75`,
        placement === 'top' && tw`top-[-54px] left-[-68px] w-48`,
        placement === 'bottom' && tw`top-[-102px] left-[-60px] 2xl:left-[-68px] w-48`,
        placement === 'right' && tw`top-[-80px] left-[0px] w-full`
      ]}
    >
      <ItemCard item={item} />
    </motion.div>
    <div>
      <Icons name={item.xlink} size={56} tw="pointer-events-none" />
      <div tw="pt-3 w-20 -ml-3 text-center">{item.text}</div>
    </div>
  </div>
)

export default FlowCell
