import { useEffect, useCallback } from 'react'
import { set } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { get } from 'lodash-es'
import tw, { styled } from 'twin.macro'
import {
  PageTab,
  Loading,
  Icon,
  Button,
  InputSearch,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { Control } from '@QCFE/lego-ui'
import { Card, Tabs, TabPanel } from 'components'
import { WorkSpaceContext } from 'contexts'
import { useQueryRegion } from 'hooks'
import SpaceLists from './SpaceLists'
import SpaceModal from './SpaceModal'
import BestPractice from './BestPractice'

const tabs = [
  {
    title: '工作空间',
    description:
      '工作空间是在大数据平台内管理任务、成员，分配角色和权限的基本单元。工作空间管理员可以加入成员至工作空间，并赋予工作空间管理员、开发、运维、部署、安全管理员或访客角色，以实现多角色协同工作。',
    icon: 'project',
    key: 'workspace',
    helpLink: '/compute/vm/',
  },
]

const Wrapper = styled('div')<{ isModal?: boolean }>(({ isModal }) => [
  tw`h-full overflow-auto`,
  !isModal && tw`p-5`,
])

const Content = styled(Card)(({ isModal }: { isModal?: boolean }) => [
  tw`pt-5 relative`,
  isModal && tw`shadow-none mb-0`,
])

interface IWrokSpaceProps {
  isModal?: boolean
  onItemCheck?: (regionId: string, spaceId: string) => void
}

const columnSettingsKey = 'BIGDATA_SPACELISTS_COLUMN_SETTINGS'

const WorkSpace = observer(({ isModal, onItemCheck }: IWrokSpaceProps) => {
  const { status, refetch, data: regionInfos } = useQueryRegion()
  // const [columnSettingsObj] = useLocalStorage(columnSettingsKey, [])
  const stateStore = useLocalObservable(() => ({
    isModal,
    onItemCheck,
    scrollElem: null,
    cardView: true,
    defaultColumns: [
      { title: '空间名称/id', dataIndex: 'id', fixedInSetting: true },
      { title: '空间状态', dataIndex: 'status' },
      { title: '空间所有者', dataIndex: 'owner' },
      { title: '成员数', dataIndex: 'name' },
      { title: '描述', dataIndex: 'desc' },
      { title: '创建时间', dataIndex: 'created' },
      { title: '操作', dataIndex: 'updated' },
    ],
    columnSettingsKey,
    // columnSettings: get(columnSettingsObj, 'value', []),
    columnSettings: localstorage.getItem(columnSettingsKey) || [],
    curRegionId: get(regionInfos, '[0].id', ''),
    curSpace: null,
    get curSpaceId(): any {
      return get(this, 'curSpace.id', '')
    },
    optSpaces: [],
    get optSpaceIds() {
      return get(this, 'optSpaces', []).map(({ id }) => id)
    },
    get optSpacesNames() {
      return get(this, 'optSpaces', []).map(({ name }) => name)
    },
    curSpaceOpt: '',
    set(params: any) {
      set(this, { ...params })
    },
    ifNoData: false,
    queryRefetch: false,
    queryKeyWord: '',
  }))

  useEffect(() => {
    if (regionInfos?.length) {
      stateStore.set({ curRegionId: get(regionInfos, '[0].id', '') })
    }
  }, [regionInfos, stateStore])

  const handleTabClick = (tabName: string) => {
    stateStore.set({ curRegionId: tabName })
  }

  const reloadWorkSpace = () => {
    stateStore.set({ queryRefetch: true })
  }

  const handleQuery = (v: string) => {
    stateStore.set({ queryKeyWord: v })
  }

  const renderNoSuccess = useCallback(
    (st: string) => {
      if (st === 'loading') {
        return <Loading size="large" delay={150} />
      }
      if (st === 'error') {
        return <Button onClick={() => refetch()}>重试</Button>
      }
      return null
    },
    [refetch]
  )

  return (
    <Wrapper
      isModal={isModal}
      ref={(ref) => stateStore.set({ scrollElem: ref })}
    >
      {!isModal && <PageTab tabs={tabs} />}
      {status !== 'success' ? (
        <div tw="h-80">{renderNoSuccess(status)}</div>
      ) : (
        <WorkSpaceContext.Provider value={stateStore}>
          <Content isModal={isModal}>
            {isModal && (
              <div tw="absolute top-6 right-5 flex space-x-2 z-10">
                <Button
                  type="icon"
                  loading={stateStore.queryRefetch}
                  onClick={reloadWorkSpace}
                >
                  <Icon name="if-refresh" tw="text-xl" />
                </Button>
                <Control className="has-icons-left has-icons-right">
                  <i className="icon is-left if-magnifier" />
                  <InputSearch
                    type="text"
                    placeholder="工作空间、ID、角色"
                    name="search"
                    onPressEnter={(e) =>
                      handleQuery((e.target as HTMLInputElement).value)
                    }
                    tw="w-52 rounded-2xl"
                    onClear={() => handleQuery('')}
                  />
                </Control>
              </div>
            )}

            {regionInfos && regionInfos?.length > 0 && (
              <Tabs
                tabClick={handleTabClick}
                activeName={stateStore.curRegionId}
              >
                {regionInfos?.map((regionInfo) => (
                  <TabPanel
                    key={regionInfo.id}
                    label={regionInfo.name}
                    name={regionInfo.id}
                  >
                    {stateStore.curRegionId === regionInfo.id && (
                      <SpaceLists region={regionInfo} />
                    )}
                  </TabPanel>
                ))}
              </Tabs>
            )}
          </Content>

          {!isModal && stateStore.ifNoData && <BestPractice />}
          {stateStore.curSpaceOpt !== '' && (
            <SpaceModal
              region={regionInfos?.find(
                (info) => info.id === stateStore.curRegionId
              )}
            />
          )}
        </WorkSpaceContext.Provider>
      )}
    </Wrapper>
  )
})

export default WorkSpace
