import React from 'react'
import tw, { css } from 'twin.macro'
import { motion } from 'framer-motion'
import { Center, Icons } from 'components'
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
  <div tw="w-[100px]">
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      whileHover={{ opacity: 1, scale: 1, transition: { duration: 0.25 } }}
      css={[
        tw`absolute z-20 h-[300px] opacity-100 scale-75`,
        placement === 'top' && tw`top-[-54px] left-[-68px] w-48`,
        placement === 'bottom' && tw`top-[-102px] left-[-60px] 2xl:left-[-68px] w-48`,
        placement === 'right' && tw`top-[-102px] left-[0px] w-full`
      ]}
    >
      <ItemCard item={item} />
    </motion.div>
    <div>
      <Center tw="w-[100px] h-[114px] bg-white rounded-[4px] ">
        <Icons name={item.xlink} size={56} tw="pointer-events-none" />
      </Center>
      <div
        tw="pt-4 text-center"
        css={css`
          font-weight: 600;
          font-size: 14px;
          line-height: 19px;
          letter-spacing: -0.03em;
          color: #024d8e;
        `}
      >
        {item.text}
      </div>
    </div>
  </div>
)

export default FlowCell
