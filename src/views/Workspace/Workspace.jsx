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
    title: '工作空间test1',
    id: 'spaceid-ienng01',
    status: 'active',
    subtitle: '这是一段很长的关于工作空间的描述信息。',
    owner: '空间所有者',
    members: ['1@yunify.com', '2@yunify.com', '3@yunify.com'],
    opened: ['共享Flink、QingMR、Deep Learning'],
    ctime: '2021-03-17 21:20:29',
  },
  {
    title: '工作空间test2',
    id: 'spaceid-ienng02',
    status: 'active',
    subtitle: '这是一段很长的关于工作空间的描述信息。',
    owner: '空间所有者',
    members: ['1@yunify.com', '2@yunify.com', '3@yunify.com'],
    opened: ['共享Flink、QingMR、Deep Learning'],
    ctime: '2021-03-17 21:20:29',
  },
  {
    title: '测试数据迁移',
    id: 'spaceid-ienng03',
    status: 'inactive',
    subtitle: '这是一段很长的关于工作空间的描述信息。',
    owner: '空间所有者',
    members: ['1@yunify.com', '2@yunify.com', '3@yunify.com'],
    opened: ['共享Flink、QingMR、Deep Learning'],
    ctime: '2021-03-17 21:20:29',
  },
  {
    title: 'DataTest001',
    id: 'spaceid-ienng04',
    status: 'active',
    subtitle: '这是一段很长的关于工作空间的描述信息。',
    owner: '空间所有者',
    members: ['1@yunify.com', '2@yunify.com', '3@yunify.com'],
    opened: ['共享Flink、QingMR、Deep Learning'],
    ctime: '2021-03-17 21:20:29',
  },
  {
    title: 'DataTest002',
    id: 'spaceid-ienng05',
    status: 'active',
    subtitle: '这是一段很长的关于工作空间的描述信息。',
    owner: '空间所有者',
    members: ['1@yunify.com', '2@yunify.com', '3@yunify.com'],
    opened: ['共享Flink、QingMR、Deep Learning'],
    ctime: '2021-03-17 21:20:29',
  },
  {
    title: 'DataTest003',
    id: 'spaceid-ienng06',
    status: 'active',
    subtitle: '这是一段很长的关于工作空间的描述信息。',
    owner: '空间所有者',
    members: ['1@yunify.com', '2@yunify.com', '3@yunify.com'],
    opened: ['共享Flink、QingMR、Deep Learning'],
    ctime: '2021-03-17 21:20:29',
  },
  {
    title: 'DataTest004',
    id: 'spaceid-ienng07',
    status: 'active',
    subtitle: '这是一段很长的关于工作空间的描述信息。',
    owner: '空间所有者',
    members: ['1@yunify.com', '2@yunify.com', '3@yunify.com'],
    opened: ['共享Flink、QingMR、Deep Learning'],
    ctime: '2021-03-17 21:20:29',
  },
]

const Workspace = () => {
  return (
    <div className="tw-p-5 tw-text-xs">
      <PageTab tabs={tabs} />
      <Card className="tw-pt-5">
        <Tabs
          // tabClick={(value) => console.log(value)}
          index={0}
          more={
            <Button type="text">
              <Icon name="add" />
              开通新区域
            </Button>
          }
        >
          <TabPanel label="北京三区">
            <SpaceLists
              className="tw-px-5 tw-py-3"
              dataSource={workspacesData}
            />
          </TabPanel>
          <TabPanel label="广东1区">广东1</TabPanel>
          <TabPanel label="广东2区">广东2</TabPanel>
        </Tabs>
      </Card>
    </div>
  )
}

export default Workspace
