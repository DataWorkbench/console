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
    <div tw="p-5 pb-0 text-xs h-full overflow-auto">
      <PageTab tabs={tabs} />
      <div tw="bg-white rounded">
        <img src={tabsvg0} alt="" tw="mx-auto w-full" />
        <img src={tabsvg} alt="" tw="mx-auto w-10/12" />
      </div>
    </div>
  )
}
export default Setting
