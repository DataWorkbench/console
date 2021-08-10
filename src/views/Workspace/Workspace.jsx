import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { useMount } from 'react-use'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { PageTab, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import Card, { CardHeader, CardContent, IconCard } from 'components/Card'
import Tabs, { TabPanel } from 'components/Tabs'
import Guide from 'components/Guide'
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

const guideData = {
  title: '使用指引',
  items: [
    {
      title: '资源规划',
      desc: '根据您的自身业务需求，选择引擎和工作空间所在的区域及可用区，进行资源的规划，方便后续平台内部的统一运维管理。',
      link: '##',
    },
    {
      title: '绑定引擎',
      desc: '给工作空间绑定您需要进行实时计算、交互式分析、Graph Compute或AnalyticDB for PostgreSQL计算引擎，请首先开通相应的服务，才能进行选择。',
      link: '##',
    },
    {
      title: '添加成员及权限',
      desc: '如果您成为工作空间所有者，代表该工作空间内的所有东西都属于您。在给别人赋权之前，任何人无权限访问您的空间。如果您使用的是子账号创建的工作空间，则该工作空间会同时属于子账号和对应的主账号。',
      link: '##',
    },
  ],
}

const Workspace = ({ isModal }) => {
  const [curTabIdx, setCurTabIdx] = useState(0)
  const [hasWorkSpaces] = useState(true)
  const scrollParentRef = useRef(null)

  const {
    globalStore: { user },
    workspaceStore,
  } = useStore()

  useMount(() => {
    workspaceStore.set({ zones: {} })
  })

  const renderNoWorkSpaces = () => {
    return (
      <div>
        <div className="tw-bg-white tw-pb-20">
          <div className="tw-h-96 tw-border-b tw-border-neut-2 tw-flex tw-items-center tw-justify-center">
            <div className="tw-w-[700px] tw-text-center">
              <Icon name="project" size={48} />
              <div className="tw-font-medium tw-text-xl tw-mt-5">
                暂无工作空间
              </div>
              <div className="tw-mt-4 tw-text-neut-8">
                工作空间是在大数据平台内管理任务、成员，分配角色和权限的基本单元。工作空间管理员可以加入成员至工作空间，并赋予工作空间管理员、开发、运维、部署、安全管理员或访客角色，以实现多角色协同工作。
              </div>
              <div className="tw-space-x-4 tw-mt-5">
                <Button type="primary">
                  <Icon name="add" />
                  创建工作空间
                </Button>
                <Button type="default">
                  <Icon name="documentation" />
                  使用指南
                </Button>
              </div>
            </div>
          </div>
          <Guide
            className="tw-mt-10 tw-mx-8 2xl:tw-mx-10"
            title={guideData.title}
            items={guideData.items}
          />
        </div>
        <div className="tw-flex tw-mt-4">
          <Card className="tw-flex-1 tw-mr-4">
            <CardHeader title="最佳实践" />
            <CardContent className="tw-flex tw-justify-center tw-space-x-2 2xl:tw-space-x-5">
              <IconCard
                className="tw-flex-1"
                icon="templet"
                title="沧州银行大数据工作台+弹性存储最佳实践"
                subtitle="通用云上弹性服务器配合大数据处理的最佳实践"
              />
              <IconCard
                icon="templet"
                className="tw-flex-1"
                title="大数据工作台流批一体最佳实践"
                subtitle="通过流批一体的方式，轻量化解决企业数据处理"
              />
            </CardContent>
          </Card>
          <Card className="tw-w-4/12 tw-leading-5">
            <CardHeader title="相关产品" />
            <CardContent className="tw-pb-3 tw-flex tw-justify-center tw-space-x-2 2xl:tw-space-x-5">
              <IconCard icon="laptop" title="QingMr" layout="vertical" />
              <IconCard icon="laptop" title="MySQL" layout="vertical" />
              <IconCard icon="laptop" title="Hbase" layout="vertical" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'tw-text-xs tw-h-full tw-overflow-auto',
        isModal ? '' : 'tw-p-5'
      )}
    >
      {!hasWorkSpaces ? (
        renderNoWorkSpaces()
      ) : (
        <div ref={scrollParentRef} className={clsx('!tw-pb-0')}>
          {!isModal && <PageTab tabs={tabs} />}
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
                {scrollParentRef &&
                  getUserZone().map((zone, i) => (
                    <TabPanel
                      key={zone}
                      label={user.zones_info[zone][user.lang]}
                    >
                      <SpaceLists
                        className="tw-px-5 tw-py-3"
                        zone={zone}
                        isModal
                        isCurrent={curTabIdx === i}
                        scrollParent={scrollParentRef.current}
                      />
                    </TabPanel>
                  ))}
              </Tabs>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

Workspace.propTypes = {
  isModal: PropTypes.bool,
}

Workspace.defaultProps = {
  isModal: false,
}

export default observer(Workspace)
