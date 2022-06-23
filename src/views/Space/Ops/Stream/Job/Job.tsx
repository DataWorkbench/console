import React from 'react'
import { FlexBox } from 'components'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { streamInstanceTabs } from 'views/Space/Ops/Stream1/common/constants'
import { InstanceTable } from '../Release/InstanceTable'

export const Job = () => {
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={streamInstanceTabs} />
      <div tw="px-5 pb-5 bg-neut-16">
        <InstanceTable tw="flex flex-1" modalData={{}} />
      </div>
    </FlexBox>
  )
}

export default Job
