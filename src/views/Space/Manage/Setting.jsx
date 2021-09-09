import React from 'react'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import tabsvg from 'assets/manage_setting.svg'
import tabsvg0 from 'assets/manage_setting0.svg'

const tabs = [
  {
    title: '权限列表',
    description: '通过给空间成员分配不同的角色来实现权限控制管理.',
    icon: 'project',
  },
]
function Setting() {
  return (
    <div tw="tw-p-5 tw-pb-0 tw-text-xs tw-h-full tw-overflow-auto">
      <PageTab tabs={tabs} />
      <div tw="tw-bg-white tw-rounded">
        <img src={tabsvg0} alt="" tw="tw-mx-auto tw-w-full" />
        <img src={tabsvg} alt="" tw="tw-mx-auto tw-w-10/12" />
      </div>
    </div>
  )
}
export default Setting
