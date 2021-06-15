import React from 'react'
import { observer } from 'mobx-react'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import Card, { CardHeader, CardContent } from 'components/Card'
import { useStore } from 'stores'
import ServiceItem from './ServiceItem'
import PlatformFeat from './PlatformFeat/PlatformFeat'
import FAQ from './FAQ'
import Practice from './Practice'
import IconCard from './IconCard'

function getTabs(user) {
  return [
    {
      title: `上午好，${
        user.user_name ? `${user.user_name}，` : ''
      }欢迎您使用大数据平台`,
      description:
        '大数据平台开发一站式智能开发，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力。实现数据在云平台各产品之间快速流转，支撑上层业务应用，消除企业数据孤岛，带动大数据周边产品消费。',
      icon: 'dashboard',
      newsLink: '/compute/vm/news/product_news/',
      helpLink: '/compute/vm/',
    },
  ]
}

function Overview() {
  const store = useStore()
  const {
    globalStore: { user },
  } = store
  return (
    <div className="p-5 overview h-full">
      <PageTab tabs={getTabs(user)} />
      <ServiceItem />
      <div className="flex">
        <PlatformFeat className="flex-1 mr-4" />
        <FAQ className="w-4/12" />
      </div>
      <div className="flex">
        <Practice className="flex-1 mr-4" />
        <Card className="w-4/12 leading-5">
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
    </div>
  )
}

export default observer(Overview)
