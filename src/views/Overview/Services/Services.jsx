import React from 'react'
import Card from 'components/Card'
import { useStore } from 'stores'
import Flow from './Flow'
import FlowCell from './FlowCell'

function Services() {
  const {
    overViewStore: { items },
  } = useStore()
  const flowItems = items.slice(0, 5)
  const opsItem = items.slice(-1)[0]
  return (
    <Card>
      <div tw="px-5 py-3 font-semibold text-base">
        &#127775;<span tw="ml-2">服务内容</span>
      </div>
      <div tw="px-5 py-2.5 border-t border-neut-2 flex font-medium text-sm text-neut-15 h-80 space-x-4">
        <div tw="border border-green-4 border-dashed rounded-sm bg-green-0 px-12 2xl:px-[68px] flex items-center flex-1">
          <Flow items={flowItems} />
        </div>
        <div tw="border border-[#BAE6FD] border-dashed rounded-sm bg-[#ECFBFF] flex justify-center min-w-[200px] w-2/12">
          <div tw="relative mt-20 w-full flex justify-center">
            <FlowCell item={opsItem} placement="right" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Services
