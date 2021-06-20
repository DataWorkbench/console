import React from 'react'
import Card from 'components/Card'
import Icon from 'components/Icon'
import LifeCycle from './LifeCycle'

function ServiceItem() {
  return (
    <Card>
      <div className="px-5 py-3 font-semibold text-base">
        &#127775;&nbsp;服务内容
      </div>
      <div className="px-5 py-3 border-t border-neutral-N2 flex font-medium text-sm text-neutral-N15 h-80">
        <div className="border border-brand-G4 border-dashed rounded-sm bg-brand-G0 px-16 py-5 flex items-center  mr-4 flex-1">
          <LifeCycle className="w-full" />
        </div>
        <div className="border border-blue-100 border-dashed rounded-sm bg-blue-50 w-2/12">
          <div className="flex flex-col items-center pt-16">
            <div>
              <Icon name="icon_service_5" width={56} height={56} />
            </div>
            <div className="pt-3">运维中心</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ServiceItem
