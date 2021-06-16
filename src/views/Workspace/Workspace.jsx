import React from 'react'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { Button, Icon } from '@QCFE/lego-ui'
import Card from 'components/Card'
import Tabs, { TabPanel } from 'components/Tabs'
import SpaceLists from './SpaceLists'
// const { TabPanel } = Tabs
const tabs = [
  {
    title: `工作空间`,
    description:
      '工作空间是在大数据平台内管理任务、成员，分配角色和权限的基本单元。工作空间管理员可以加入成员至工作空间，并赋予工作空间管理员、开发、运维、部署、安全管理员或访客角色，以实现多角色协同工作。',
    icon: 'project',
    helpLink: '/compute/vm/',
  },
]

const workspacesData = [
  {
    title: '第一个',
  },
  {
    title: '第一个',
  },
  {
    title: '第一个',
  },
  {
    title: '第一个',
  },
  {
    title: '第一个',
  },
  {
    title: '第一个',
  },
  {
    title: '第一个',
  },
]

const Workspace = () => {
  return (
    <div className="p-5 workspace">
      <PageTab tabs={tabs} />
      <Card className="pt-5">
        <Tabs
          tabClick={(value) => console.log(value)}
          index={0}
          more={
            <Button type="text">
              <Icon name="add" />
              开通新区域
            </Button>
          }
        >
          <TabPanel label="北京三区">
            <SpaceLists className="px-5 py-4" dataSource={workspacesData} />
          </TabPanel>
          <TabPanel label="广东1区">广东1</TabPanel>
          <TabPanel label="广东2区">广东2</TabPanel>
        </Tabs>
      </Card>
    </div>
  )
}

export default Workspace
