import React from 'react'
import Card from 'components/Card'
import Icon from 'components/Icon'
import LifeCycle from './LifeCycle'

function ServiceItem() {
  return (
    <Card>
      <div className="tw-px-5 tw-py-3 tw-font-semibold tw-text-base">
        &#127775;&nbsp;服务内容
      </div>
      <div className="tw-px-5 tw-py-3 tw-border-t tw-border-neutral-N2 tw-flex tw-font-medium tw-text-sm tw-text-neutral-N15 tw-h-80">
        <div className="tw-border tw-border-brand-G4 tw-border-dashed tw-rounded-sm tw-bg-brand-G0 tw-px-16 tw-py-5 tw-flex tw-items-center  tw-mr-4 tw-flex-1">
          <LifeCycle className="tw-w-full" />
        </div>
        <div className="tw-border tw-border-blue-100 tw-border-dashed tw-rounded-sm tw-bg-blue-50 tw-w-2/12">
          <div className="tw-flex tw-flex-col tw-items-center tw-pt-16">
            <div>
              <Icon name="icon_service_5" width={56} height={56} />
            </div>
            <div className="tw-pt-3">运维中心</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ServiceItem
