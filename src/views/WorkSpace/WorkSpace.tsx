import { useRef } from 'react'
import { set } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useLifecycles, useToggle } from 'react-use'
import { get, throttle } from 'lodash-es'
import tw, { styled } from 'twin.macro'
import {
  PageTab,
  Loading,
  Icon,
  Button,
  InputSearch,
} from '@QCFE/qingcloud-portal-ui'
import { Control } from '@QCFE/lego-ui'
import { Card, Tabs, TabPanel } from 'components'
import { useStore } from 'stores'
import { WorkSpaceContext } from 'contexts'
import SpaceLists from './SpaceLists'
import SpaceModal from './SpaceModal'
import BestPractice from './BestPractice'

const tabs = [
  {
    title: '工作空间',
    description:
      '工作空间是在大数据平台内管理任务、成员，分配角色和权限的基本单元。工作空间管理员可以加入成员至工作空间，并赋予工作空间管理员、开发、运维、部署、安全管理员或访客角色，以实现多角色协同工作。',
    icon: 'project',
  },
]

const storageKey = 'BIGDATA_SPACELISTS_COLUMN_SETTINGS'

const Wrapper = styled('div')<{ isModal: boolean }>(({ isModal }) => [
  tw`h-full overflow-auto`,
  !isModal && tw`p-5`,
])

const Content = styled(Card)(
  ({ showLoading, isModal }: { showLoading: boolean; isModal: boolean }) => [
    tw`pt-5 relative`,
    showLoading && tw`h-80`,
    isModal && tw`shadow-none mb-0`,
  ]
)
interface WorkSpaceProps {
  isModal: boolean
  onSpaceSelected: any
}

const WorkSpace = observer(({ isModal, onSpaceSelected }: WorkSpaceProps) => {
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
    get(curRegion, 'params.offset') === 0 &&
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
    workSpaceStore.fetchData({
      regionId,
      cardView,
      force: true,
      search: v,
      offset: 0,
    })
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

  return (
    <WorkSpaceContext.Provider value={stateStore}>
      <Wrapper isModal={isModal} onScroll={handleScroll} ref={scrollParentRef}>
        {!isModal && <PageTab tabs={tabs} />}
        <Content showLoading={loading} isModal={isModal}>
          {isModal && (
            <div tw="absolute top-6 right-5 flex space-x-2 z-10">
              <Button type="icon" onClick={reloadSpace}>
                <Icon name="if-refresh" tw="text-xl" />
              </Button>
              <Control className="has-icons-left has-icons-right">
                <i className="icon is-left if-magnifier" />
                <InputSearch
                  type="text"
                  placeholder="工作空间、ID、角色"
                  name="search"
                  onPressEnter={(e) => handleQuery(e.target.value)}
                  tw="w-52 rounded-2xl"
                  onClear={() => handleQuery('')}
                />
              </Control>
            </div>
          )}
          <Loading size="large" spinning={loading} delay={150}>
            {regionInfos.length > 0 && (
              <Tabs tabClick={handleTabClick} activeName={curRegionId}>
                {regionInfos.map((regionInfo) => (
                  <TabPanel
                    key={regionInfo.id}
                    label={regionInfo.name}
                    name={regionInfo.id}
                  >
                    <SpaceLists region={regionInfo} />
                  </TabPanel>
                ))}
              </Tabs>
            )}
          </Loading>
        </Content>

        {!isModal && isNodata && <BestPractice />}
        {stateStore.curSpaceOpt !== '' && (
          <SpaceModal
            region={regionInfos.find((info) => info.id === curRegionId)}
            onHide={handleHide}
          />
        )}
      </Wrapper>
    </WorkSpaceContext.Provider>
  )
})

export default WorkSpace
