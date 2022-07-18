import { Icon } from '@QCFE/lego-ui'
import React from 'react'
import tw, { styled } from 'twin.macro'

export interface EmptyProps {
  description: string
  icon?: React.ReactNode
}

const EmptyWarp = styled.div`
  & {
    ${tw`h-[250px] overflow-hidden border-neut-13! border-t-[1px]`}
  }

  & > div {
    ${tw`h-full flex justify-center items-center`}
    .emptyBox {
      ${tw`h-[112px] w-[112px] flex-col`}
    }
    .text {
      ${tw`text-neut-0`}
    }
  }
`

const Empty = (props: EmptyProps) => {
  const { description, icon = <Icon name="display" size={56} /> } = props

  return (
    <EmptyWarp>
      <div>
        <div className="emptyBox">
          {icon}
          <div className="text">
            <span>{description}</span>
          </div>
        </div>
      </div>
    </EmptyWarp>
  )
}

export default Empty
