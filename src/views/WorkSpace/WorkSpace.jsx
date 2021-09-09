import React, { useState, useRef } from 'react'
import { set } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useLifecycles, useToggle } from 'react-use'
import PropTypes from 'prop-types'
import { get, isEqual, throttle } from 'lodash'
import tw from 'twin.macro'
import {
  PageTab,
  Loading,
  Icon,
  Button,
  InputSearch,
} from '@QCFE/qingcloud-portal-ui'
import { Control } from '@QCFE/lego-ui'
import Card, { CardHeader, CardContent, IconCard } from 'components/Card'
import Tabs, { TabPanel } from 'components/Tabs'
import { useStore } from 'stores'
import { WorkSpaceContext } from 'contexts'
import SpaceLists from './SpaceLists'
import SpaceModal from './SpaceModal'

const tabs = [
  {
    title: '工作空间',
    description:
      '工作空间是在大数据平台内管理任务、成员，分配角色和权限的基本单元。工作空间管理员可以加入成员至工作空间，并赋予工作空间管理员、开发、运维、部署、安全管理员或访客角色，以实现多角色协同工作。',
    icon: 'project',
  },
]

const storageKey = 'BIGDATA_SPACELISTS_COLUMN_SETTINGS'

const WorkSpace = ({ isModal, onSpaceSelected }) => {
  const [curTabName, setCurTabName] = useState(null)
  const [loading, setLoading] = useToggle(true)
  const scrollParentRef = useRef(null)
  const stateStore = useLocalObservable(() => ({
    isModal,
    onSpaceSelected,
    cardView: true,
    storageKey,
    scrollElem: null,
    defaultColumns: [
      { title: '空间名称/id', dataIndex: 'id', fixedInSetting: true },
      { title: '空间状态', dataIndex: 'status' },
      { title: '空间所有者', dataIndex: 'owner' },
      { title: '成员数', dataIndex: 'name' },
      { title: '描述', dataIndex: 'desc' },
      { title: '创建时间', dataIndex: 'created' },
      { title: '操作', dataIndex: 'updated' },
    ],
    columnSettings:
      get(JSON.parse(localStorage.getItem(storageKey)), 'value') || [],
    curRegionId: null,
    curSpace: null,
    get curSpaceId() {
      return get(this, 'curSpace.id', null)
    },
    optSpaces: [],
    get optSpaceIds() {
      return get(this, 'optSpaces', []).map(({ id }) => id)
    },
    get optSpacesNames() {
      return get(this, 'optSpaces', []).map(({ name }) => name)
    },
    curSpaceOpt: '',
    set(params) {
      set(this, { ...params })
    },
  }))

  const {
    globalStore,
    globalStore: { regionInfos },
    workSpaceStore,
    workSpaceStore: { regions },
  } = useStore()
  const { curRegionId } = stateStore
  const curRegion = get(regions, curRegionId)
  const isNodata =
    isEqual(get(curRegion, 'filter') === { offset: 0, limit: 10 }) &&
    get(curRegion, 'hasMore') === false &&
    get(curRegion, 'total') === 0

  useLifecycles(
    () => {
      globalStore
        .loadRegions()
        .then((infos) => {
          if (infos?.length > 0) {
            stateStore.set({ curRegionId: get(infos, '[0].id') })
            workSpaceStore.fetchData({
              regionId: stateStore.curRegionId,
              cardView: stateStore.cardView,
              offset: 0,
            })
          }
        })
        .finally(() => setLoading(false))
    },
    () => {
      workSpaceStore.set({ regions: {}, curRegionId: null })
    }
  )

  const handleTabClick = (tabName) => {
    setCurTabName(tabName)
    stateStore.set({ curRegionId: tabName })
    if (!get(regions, tabName)) {
      workSpaceStore.fetchData({
        regionId: tabName,
        cardView: stateStore.cardView,
        offset: 0,
      })
    }
  }

  const handleHide = (ifRefresh) => {
    if (ifRefresh) {
      const { curSpaceOpt, curRegionId: regionId, cardView } = stateStore
      if (curSpaceOpt === 'create') {
        workSpaceStore.fetchData({
          regionId,
          cardView,
          offset: 0,
        })
      }
    }
    stateStore.set({ curSpaceOpt: '' })
  }

  const reloadSpace = () => {
    const { curRegionId: regionId, cardView } = stateStore
    workSpaceStore.fetchData({
      regionId,
      cardView,
      force: true,
      offset: 0,
    })
  }

  const handleQuery = (v) => {
    const { curRegionId: regionId, cardView } = stateStore
    const params = {
      regionId,
      cardView,
      force: true,
      search: v,
      offset: 0,
    }
    workSpaceStore.fetchData(params)
  }

  const handleScroll = throttle(() => {
    const { curRegionId: regionId, cardView } = stateStore
    if (cardView) {
      const el = scrollParentRef.current
      const dist = el.scrollHeight - el.clientHeight - el.scrollTop
      if (el.scrollTop > 0 && dist < 250) {
        // console.log(dist)
        workSpaceStore.fetchData({
          regionId,
          cardView,
        })
      }
    }
  }, 150)

  const renderNoWorkSpaces = () => {
    return (
      <div tw="tw-flex tw-mt-4">
        <Card className={tw`tw-flex-1 tw-mr-4`}>
          <CardHeader title="最佳实践" />
          <CardContent
            className={tw`tw-flex tw-justify-center tw-space-x-2 2xl:tw-space-x-5`}
          >
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
        <Card className={tw`tw-w-4/12 tw-leading-5`}>
          <CardHeader title="相关产品" />
          <CardContent
            className={tw`tw-pb-3 tw-flex tw-justify-center tw-space-x-2 2xl:tw-space-x-5`}
          >
            <IconCard icon="laptop" title="QingMr" layout="vertical" />
            <IconCard icon="laptop" title="MySQL" layout="vertical" />
            <IconCard icon="laptop" title="Hbase" layout="vertical" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <WorkSpaceContext.Provider value={stateStore}>
      <div
        css={[
          tw`tw-text-xs tw-h-full tw-overflow-auto`,
          isModal ? '' : tw`tw-p-5`,
        ]}
        onScroll={handleScroll}
        // ref={(el) => stateStore.set({ scrollElem: el })}
        ref={scrollParentRef}
      >
        <div tw="tw-pb-0!">
          {!isModal && <PageTab tabs={tabs} />}
          <Card
            css={[
              tw`tw-pt-5 tw-relative`,
              loading && tw`tw-h-80`,
              isModal && tw`tw-shadow-none tw-mb-0`,
            ]}
          >
            {isModal && (
              <div tw="tw-absolute tw-top-6 tw-right-5 tw-flex tw-space-x-2 tw-z-10">
                <Button type="icon" onClick={reloadSpace}>
                  <Icon name="if-refresh" className={tw`tw-text-xl`} />
                </Button>
                <Control className="has-icons-left has-icons-right">
                  <i className="icon is-left if-magnifier" />
                  <InputSearch
                    type="text"
                    placeholder="工作空间、ID、角色"
                    name="search"
                    onPressEnter={(e) => handleQuery(e.target.value)}
                    className={tw`tw-w-52 tw-rounded-2xl`}
                    onClear={() => handleQuery('')}
                  />
                </Control>
              </div>
            )}
            <Loading size="large" spinning={loading} delay={150}>
              {regionInfos.length > 0 && (
                <Tabs
                  name={curTabName}
                  tabClick={handleTabClick}
                  activeName={curRegionId}
                >
                  {regionInfos.map((regionInfo) => (
                    <TabPanel
                      key={regionInfo.id}
                      label={regionInfo.name}
                      name={regionInfo.id}
                    >
                      <SpaceLists
                        tw="tw-px-5 tw-py-3"
                        region={regionInfo}
                        isCurrent={regionInfo.id === curRegionId}
                        // scrollParent={scrollParentRef.current}
                      />
                    </TabPanel>
                  ))}
                </Tabs>
              )}
            </Loading>
          </Card>
        </div>
        {!isModal && isNodata && renderNoWorkSpaces()}
        {stateStore.curSpaceOpt !== '' && (
          <SpaceModal
            region={regionInfos.find((info) => info.id === curRegionId)}
            onHide={handleHide}
          />
        )}
      </div>
    </WorkSpaceContext.Provider>
  )
}

WorkSpace.propTypes = {
  isModal: PropTypes.bool,
  onSpaceSelected: PropTypes.func,
}

WorkSpace.defaultProps = {
  onSpaceSelected: () => {},
}

export default observer(WorkSpace)
