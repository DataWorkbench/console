import React from 'react'
import { observer } from 'mobx-react-lite'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash'
import Card, { CardHeader, CardContent } from 'components/Card'
import { useStore } from 'stores'
import SpaceListModal from './SpaceListModal'
import Services from './Services'
import PlatformFeat from './PlatformFeat/PlatformFeat'
import FAQ from './FAQ'
import Practice from './Practice'
import IconCard from './IconCard'

function getTabs(user) {
  return [
    {
      title: (
        <span className="tw-font-semibold">
          上午好，{get(user, 'user_name', '')}，欢迎您使用大数据平台
        </span>
      ),
      description:
        '大数据平台开发一站式智能开发，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力。实现数据在云平台各产品之间快速流转，支撑上层业务应用，消除企业数据孤岛，带动大数据周边产品消费。',
      icon: 'dashboard',
      newsLink: '/qingstor/price/',
      helpLink: '/qingstor/access_control/',
    },
  ]
}

function Overview() {
  const {
    globalStore: { user },
    overViewStore: { showSpaceModal },
  } = useStore()

  return (
    <div className="tw-p-5 tw-overview tw-h-full">
      <PageTab tabs={getTabs(user)} />
      <Services />
      <div className="tw-flex">
        <PlatformFeat className="tw-flex-1 tw-mr-4" />
        <FAQ className="tw-w-4/12" />
      </div>
      <div className="tw-flex">
        <Practice className="tw-flex-1 tw-mr-4" />
        <Card className="tw-w-4/12 tw-leading-5">
          <CardHeader title="视频介绍" />
          <CardContent>
            <IconCard
              icon="laptop"
              title="大数据工作台数据开发实操视频"
              subtitle="大数据开发的全流程实操演示"
            />
          </CardContent>
        </Card>
      </div>
      {showSpaceModal && <SpaceListModal />}
    </div>
  )
}

export default observer(Overview)
