import React from 'react'
import Card from 'components/Card'
import { useStore } from 'stores'
import Flow from './Flow'
import FlowCell from './FlowCell'

function ServiceItem() {
  const {
    overViewStore: { items },
  } = useStore()
  const flowItems = items.slice(0, 5)
  const opsItem = items.slice(-1)[0]
  return (
    <Card>
      <div className="tw-px-5 tw-py-3 tw-font-semibold tw-text-base">
        &#127775;<span className="tw-ml-2">服务内容</span>
      </div>
      <div className="tw-px-5 tw-py-2.5 tw-border-t tw-border-neut-2 tw-flex tw-font-medium tw-text-sm tw-text-neut-15 tw-h-80 tw-space-x-4">
        <div className="tw-border tw-border-green-4 tw-border-dashed tw-rounded-sm tw-bg-green-0 tw-px-12 2xl:tw-px-[68px] tw-flex tw-items-center tw-flex-1">
          <Flow items={flowItems} />
        </div>
        <div className="tw-border tw-border-[#BAE6FD] tw-border-dashed tw-rounded-sm tw-bg-[#ECFBFF] tw-flex tw-justify-center tw-w-2/12">
          <div className="tw-relative tw-mt-20 tw-w-full tw-flex tw-justify-center">
            <FlowCell item={opsItem} placement="right" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ServiceItem
