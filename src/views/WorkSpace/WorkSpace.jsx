import React, { useState, useRef, useEffect } from 'react'
import { set } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useLifecycles, useToggle } from 'react-use'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { get, isEqual } from 'lodash'
import {
  PageTab,
  Loading,
  Icon,
  Button,
  Input,
  Modal,
} from '@QCFE/qingcloud-portal-ui'
import { Control } from '@QCFE/lego-ui'
import Card, { CardHeader, CardContent, IconCard } from 'components/Card'
import Tabs, { TabPanel } from 'components/Tabs'
import { useStore } from 'stores'
import { WorkSpaceContext } from 'contexts'
import emitter from 'utils/emitter'
import SpaceLists from './SpaceLists'
import SpaceModal from './SpaceModal'
import styles from './styles.module.css'

const tabs = [
  {
    title: '工作空间',
    description:
      '工作空间是在大数据平台内管理任务、成员，分配角色和权限的基本单元。工作空间管理员可以加入成员至工作空间，并赋予工作空间管理员、开发、运维、部署、安全管理员或访客角色，以实现多角色协同工作。',
    icon: 'project',
  },
]

const storageKey = 'BIGDATA_SPACELISTS_COLUMN_SETTINGS'
const WorkSpace = ({ isModal }) => {
  const [curTabName, setCurTabName] = useState(null)
  const [loading, setLoading] = useToggle(true)
  const [delBtnEnable, setDelBtnEnable] = useState(true)
  const scrollParentRef = useRef(null)
  const stateStore = useLocalObservable(() => ({
    isModal,
    cardView: true,
    storageKey,
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
        .catch((err) => emitter.emit('error', `${err.message}`))
        .finally(() => setLoading(false))
    },
    () => {
      workSpaceStore.set({ regions: {}, curRegionId: null })
    }
  )

  useEffect(() => {
    setDelBtnEnable(stateStore.curSpaceOpt !== 'delete')
  }, [stateStore.curSpaceOpt])

  const handleTabClick = (tabName) => {
    setCurTabName(tabName)
    stateStore.set({ curRegionId: tabName })
  }

  const handleModalClose = () => {
    stateStore.set({ curSpaceOpt: '' })
    setDelBtnEnable(true)
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
    handleModalClose()
  }

  const handleDelIptChange = (e, value) => {
    setDelBtnEnable(value === stateStore.curSpaceId)
  }

  const reloadSpace = () => {
    workSpaceStore.load(curRegionId, true)
  }

  const renderNoWorkSpaces = () => {
    return (
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
    )
  }

  const renderModal = () => {
    const { curSpaceOpt: opt, optSpaceIds, optSpaces } = stateStore
    const optSpacesNames = optSpaces.map(({ name }) => name)

    if (['create', 'update'].includes(opt)) {
      return (
        <SpaceModal
          region={regionInfos.find((info) => info.id === curRegionId)}
          onHide={handleHide}
        />
      )
    }
    if (['enable', 'disable', 'delete'].includes(opt)) {
      const styleObj = {
        error: {
          icon: 'if-error-info',
          color: '#cf3b37',
          okType: 'danger',
        },
        warn: {
          icon: 'if-exclamation',
          color: '#FFD127',
          okType: 'primary',
        },
      }
      const operateObj = {
        enable: {
          opName: '启动',
          desc: '启用该工作空间，下属服务也将被启用，是否确认该工作空间进行启用操作？',
          style: styleObj.warn,
        },
        disable: {
          opName: '禁用',
          desc: '工作空间内正在运行的任务不会强制停止，已发布调度未运行的任务将不会运行。成员无法登录，是否确认进行禁用操作？',
          style: styleObj.warn,
        },
        delete: {
          opName: '删除',
          desc: (
            <div className="tw-space-y-3">
              <div>
                该工作空间内工作流、成员等数据都将彻底删除，无法恢复，请谨慎操作。
              </div>
              <div className="tw-border-t tw-border-neut-2" />
              <div>
                *请在下方输入框中输入 “{get(optSpaceIds, '0')}” 以确认操作
              </div>
              <div>
                <Input
                  type="text"
                  placeholder={get(optSpaceIds, '0')}
                  onChange={handleDelIptChange}
                />
              </div>
            </div>
          ),
          style: styleObj.error,
        },
      }
      const { style, opName, desc } = operateObj[opt]
      const state = get(workSpaceStore, 'loadStatus.state')
      return (
        <Modal
          visible
          title=""
          className={styles.modal}
          width={450}
          onCancel={handleModalClose}
          footer={
            <>
              <Button type="defalut" onClick={handleModalClose}>
                {getText('LEGO_UI_CANCEL')}
              </Button>
              <Button
                type={style.okType}
                disabled={!delBtnEnable}
                loading={state === 'pending'}
                onClick={() => {
                  workSpaceStore[opt]({
                    regionId: curRegionId,
                    spaceIds: optSpaceIds,
                  }).then(() => {
                    stateStore.set({ curSpaceOpt: '', optSpaces: [] })
                  })
                }}
              >
                {getText('LEGO_UI_OK')}
              </Button>
            </>
          }
        >
          <div className="tw-flex tw-items-start">
            <Icon
              name="if-exclamation"
              className="tw-mr-3 tw-text-2xl tw-leading-6"
              style={{ color: style.color }}
            />
            <div className="">
              <div className="tw-font-semibold tw-text-base tw-text-neut-15">
                {opName}工作空间: 工作空间{' '}
                {optSpacesNames.length > 1
                  ? optSpacesNames.join(',')
                  : get(optSpacesNames, '0')}
              </div>
              <div className="tw-text-neut-13 tw-mt-2">{desc}</div>
            </div>
          </div>
        </Modal>
      )
    }
    return null
  }

  return (
    <WorkSpaceContext.Provider value={stateStore}>
      <div
        className={clsx(
          'tw-text-xs tw-h-full tw-overflow-auto',
          isModal ? '' : 'tw-p-5'
        )}
        ref={scrollParentRef}
      >
        <div className={clsx('!tw-pb-0')}>
          {!isModal && <PageTab tabs={tabs} />}
          <Card
            className={clsx(
              'tw-pt-5 tw-relative',
              loading && 'tw-h-80',
              isModal && 'tw-shadow-none tw-mb-0'
            )}
          >
            {isModal && (
              <div className="tw-absolute tw-top-6 tw-right-5 tw-flex tw-space-x-2 tw-z-10">
                <Button type="icon" onClick={reloadSpace}>
                  <Icon name="if-refresh" className="tw-text-xl" />
                </Button>
                <Control className="has-icons-left has-icons-right">
                  <i className="icon is-left if-magnifier" />
                  <Input
                    type="text"
                    placeholder="工作空间、ID、角色"
                    name="search"
                    className="tw-w-52 tw-rounded-2xl"
                  />
                </Control>
              </div>
            )}
            <Loading size="large" spinning={loading} delay={150}>
              {regionInfos.length > 0 && scrollParentRef && (
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
                        className="tw-px-5 tw-py-3"
                        region={regionInfo}
                        isCurrent={regionInfo.id === curRegionId}
                        scrollParent={scrollParentRef.current}
                      />
                    </TabPanel>
                  ))}
                </Tabs>
              )}
            </Loading>
          </Card>
        </div>
        {!isModal && isNodata && renderNoWorkSpaces()}
        {stateStore.curSpaceOpt !== '' && renderModal()}
      </div>
    </WorkSpaceContext.Provider>
  )
}

WorkSpace.propTypes = {
  isModal: PropTypes.bool,
}

WorkSpace.defaultProps = {
  isModal: false,
}

export default observer(WorkSpace)
