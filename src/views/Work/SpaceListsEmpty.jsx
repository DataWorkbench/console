import React from 'react'
import clsx from 'clsx'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import { useWorkSpaceContext } from 'contexts'
import Guide from 'components/Guide'

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

function SpaceListsEmpty() {
  const { isModal } = useWorkSpaceContext()
  return (
    <div>
      <div className={clsx('tw-bg-white', !isModal && 'tw-pb-20')}>
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
              <Button type="default" className={clsx({ 'tw-hidden': isModal })}>
                <Icon name="documentation" />
                使用指南
              </Button>
            </div>
          </div>
        </div>
        {!isModal && (
          <Guide
            className="tw-mt-10 tw-mx-8 2xl:tw-mx-10"
            title={guideData.title}
            items={guideData.items}
          />
        )}
      </div>
    </div>
  )
}

export default SpaceListsEmpty
