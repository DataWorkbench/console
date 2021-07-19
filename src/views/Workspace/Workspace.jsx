import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useMount } from 'react-use'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { Button, Icon } from '@QCFE/lego-ui'
import Card from 'components/Card'
import Tabs, { TabPanel } from 'components/Tabs'
import { useStore } from 'stores'
import { getUserZone } from 'utils/user'
import SpaceLists from './SpaceLists'

const tabs = [
  {
    title: '工作空间',
    description:
      '工作空间是在大数据平台内管理任务、成员，分配角色和权限的基本单元。工作空间管理员可以加入成员至工作空间，并赋予工作空间管理员、开发、运维、部署、安全管理员或访客角色，以实现多角色协同工作。',
    icon: 'project',
  },
]

const Workspace = () => {
  const [curTabIdx, setCurTabIdx] = useState(0)
  const {
    globalStore: { user },
    workspaceStore,
  } = useStore()

  useMount(() => {
    workspaceStore.set({ zones: {} })
  })
  return (
    <div className="tw-p-5 tw-text-xs">
      <PageTab tabs={tabs} />
      <Card className="tw-pt-5">
        {user && (
          <Tabs
            index={curTabIdx}
            more={
              <Button type="text">
                <Icon name="add" />
                开通新区域1
              </Button>
            }
            tabClick={(i) => setCurTabIdx(i)}
          >
            {getUserZone().map((zone, i) => (
              <TabPanel key={zone} label={user.zones_info[zone][user.lang]}>
                <SpaceLists
                  className="tw-px-5 tw-py-3"
                  zone={zone}
                  isCurrent={curTabIdx === i}
                />
              </TabPanel>
            ))}
          </Tabs>
        )}
      </Card>
    </div>
  )
}

export default observer(Workspace)
