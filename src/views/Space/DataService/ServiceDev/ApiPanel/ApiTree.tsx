import { useRef, useState, useCallback, useEffect, useImperativeHandle } from 'react'
import { observer } from 'mobx-react-lite'
import { Icon, Menu } from '@QCFE/lego-ui'
import { Tree } from 'components'
import tw, { css, styled } from 'twin.macro'
import { useFetchApi, useFetchApiConfig } from 'hooks'
import { followCursor } from 'tippy.js'
import Tippy from '@tippyjs/react'
import { useUnmount } from 'react-use'
import { cloneDeep, filter, get, merge, pick } from 'lodash-es'
import { useStore } from 'stores'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import { ApiProps } from 'stores/DtsDevStore'
import qs from 'qs'
import { getNewTreeData, renderIcon, renderSwitcherIcon } from './ApiUtils'
import ApiModal from '../Modal/ApiModal'
import DelModal from '../Modal/DelModal'
import ApiGroupModal from '../Modal/ApiGroupModal'

const { MenuItem } = Menu as any

const TreeWrapper = styled('div')(() => [
  tw`relative`,
  css`
    .rc-tree {
      .rc-tree-treenode {
        span.rc-tree-node-content-wrapper {
          &.rc-tree-node-content-wrapper-open,
          &.rc-tree-node-content-wrapper-close {
            ${tw`font-semibold`}
          }
          &.rc-tree-node-content-wrapper-normal {
            ${tw`text-white text-opacity-80`}
          }
        }
      }
    }
  `
])

type CurOpProps =
  | 'createAPI'
  | 'deleteApiGroup'
  | 'deleteApi'
  | 'editAPI'
  | 'showCluster'
  | 'showRequest'
  | 'showResponse'
  | 'showVersions'
interface JobTreeProps {
  expandedKeys?: string[]
}

export interface CurrentGroupApiProps {
  name: string
  id: string
  group_path: string
  desc: string
}

export const ApiTree = observer(
  (props: JobTreeProps, ref) => {
    const { expandedKeys: expandedKeysProp } = props
    const { spaceId } = useParams<{ spaceId: string }>()
    const { search: query } = useLocation()
    const history = useHistory()
    const { verId } = qs.parse(query.slice(1))
    const fetchApi = useFetchApi()
    const fetchApiConfig = useFetchApiConfig()

    const {
      dtsDevStore,
      dtsDevStore: { treeData, loadedKeys, curApi, addPanel }
    } = useStore()

    const [expandedKeys, setExpandedKeys] = useState<string[]>(expandedKeysProp || [])
    const [curOpNode, setCurOpNode] = useState(treeData?.length > 0 ? treeData[0] : null)
    const [autoExpandParent, setAutoExpandParent] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const treeEl = useRef(null)
    const [visible, setVisible] = useState<any>(null)
    const [curOp, setCurOp] = useState<string>('')
    const [currentApi, setCurrentApi] = useState<ApiProps>()
    const [currentGroup, setCurrentGroup] = useState<CurrentGroupApiProps>()
    const [showApiModal, setShowApiModal] = useState<boolean>()
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>()
    const [showApiGroupModal, setShowApiGroupModal] = useState<boolean>()

    const [search, setSearch] = useState('')

    useUnmount((): void => {
      dtsDevStore.resetTreeData()
    })

    useEffect(() => {
      setExpandedKeys(expandedKeysProp || [])
    }, [expandedKeysProp])

    useEffect(() => {
      if (curApi) {
        setSelectedKeys([curApi.api_id])
      }
    }, [curApi])

    useImperativeHandle(ref, () => ({
      search: (v: string) => {
        dtsDevStore.resetTreeData()
        setSearch(v)
        const tree = cloneDeep(treeData)
        if (v) {
          const findTree = filter(tree, (group) => group.name.includes(v))
          if (findTree.length > 0) {
            setExpandedKeys(findTree.map((group: any) => group.key))
          }
        }
      }
    }))

    const onRightClick = useCallback(({ node }) => {
      setCurOpNode(node)
      setVisible(false)
      setTimeout(() => {
        setVisible(true)
      }, 200)
    }, [])

    const onRightMenuClick = useCallback(
      (e, key: string, val: CurOpProps, api?: ApiProps | null, Group?: CurrentGroupApiProps) => {
        if (Group) {
          const groupData = pick(Group, ['name', 'id', 'group_path', 'desc'])
          setCurrentGroup(groupData)
        }
        if (api) {
          // 操作 api 时, panel 选中当前 api
          addPanel(api)
          dtsDevStore.set({ curApi: api })
          const apiId = get(api, 'api_id')
          fetchApiConfig({ apiId }).then((res) => {
            const dataSource = cloneDeep(get(res, 'data_source'))
            const Api = merge(get(res, 'api_config'), { datasource_id: dataSource.id })
            setCurrentApi(Api)
          })
        }
        setCurOp(val)
        if (val === 'createAPI') {
          setShowApiModal(true)
        } else if (val === 'deleteApiGroup') {
          setShowDeleteModal(true)
        } else if (val === 'deleteApi') {
          setShowDeleteModal(true)
        } else if (val === 'editAPI') {
          dtsDevStore.set({ showBaseSetting: true })
        } else if (val === 'showCluster') {
          dtsDevStore.set({ showClusterSetting: true })
        } else if (val === 'showRequest') {
          dtsDevStore.set({ showRequestSetting: true })
        } else if (val === 'showResponse') {
          dtsDevStore.set({ showResponseSetting: true })
        } else if (val === 'showVersions') {
          dtsDevStore.set({ showVersions: true })
        } else if (val === 'editApiGroup') {
          setShowApiGroupModal(true)
        }
        setVisible(false)
      },
      [addPanel, dtsDevStore, fetchApiConfig]
    )

    const fetchJobTreeData = (node: any, movingNode = null) => {
      const rootKey = node.key === node.pid ? node.key : node.rootKey
      return fetchApi({
        groupId: rootKey,
        search
      })
        .then((data) => {
          const apis = get(data, 'infos', []) || []
          const newTreeData = getNewTreeData(dtsDevStore.treeData, node, apis, movingNode)
          dtsDevStore.setTreeData(newTreeData)
          setExpandedKeys([...expandedKeys, node.key])
        })
        .catch((e) => {
          setExpandedKeys(expandedKeys.filter((key) => key !== node.key))
          throw e
        })
    }

    const renderRightMenu = useCallback(
      (node) => {
        if (!node) {
          return null
        }
        if (!node.isLeaf) {
          return (
            <Menu
              onClick={(e: any, key: string, val: string | number) =>
                onRightMenuClick(e, key, val as CurOpProps, null, node)
              }
            >
              <MenuItem value="createAPI">
                <Icon name="q-apiFill" size={14} type="light" />
                <span>创建API</span>
              </MenuItem>
              <MenuItem value="editApiGroup">
                <Icon name="edit" size={14} type="light" />
                <span>编辑信息</span>
              </MenuItem>
              <MenuItem value="deleteApiGroup">
                <Icon name="delete" size={14} type="light" />
                <span>删除</span>
              </MenuItem>
            </Menu>
          )
        }
        return (
          <Menu
            onClick={(e: any, key: string, val: string | number) =>
              onRightMenuClick(e, key, val as CurOpProps, get(node, 'api', ''))
            }
          >
            <MenuItem value="editAPI">
              <Icon name="edit" size={14} type="light" />
              <span>编辑信息</span>
            </MenuItem>
            <MenuItem value="showCluster">
              <Icon name="q-dockerHubFill" size={14} type="light" />
              <span>服务集群</span>
            </MenuItem>
            <MenuItem value="showRequest">
              <Icon name="q-functionPencilFill" size={14} type="light" />
              <span>请求参数</span>
            </MenuItem>
            <MenuItem value="showResponse">
              <Icon name="q-functionPlayFill" size={14} type="light" />
              <span>返回参数</span>
            </MenuItem>
            <MenuItem value="showVersions">
              <Icon name="q-book3Fill" size={14} type="light" />
              <span>历史版本</span>
            </MenuItem>
            <MenuItem value="deleteApi">
              <Icon name="delete" size={14} type="light" />
              <span>删除</span>
            </MenuItem>
          </Menu>
        )
      },
      [onRightMenuClick]
    )

    useEffect(() => {
      dtsDevStore.resetTreeData()
    }, [spaceId, dtsDevStore])

    return (
      <>
        <Tippy
          followCursor="initial"
          plugins={[followCursor]}
          visible={visible}
          onClickOutside={() => setVisible(false)}
          interactive
          arrow={false}
          placement="right-start"
          theme="darker"
          duration={[100, 0]}
          offset={[5, 5]}
          appendTo={() => document.body}
          content={<div tw="border border-neut-13 rounded-sm">{renderRightMenu(curOpNode)}</div>}
        >
          <TreeWrapper ref={treeEl}>
            <Tree
              autoExpandParent={autoExpandParent}
              treeData={treeData}
              loadedKeys={loadedKeys}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              icon={renderIcon}
              switcherIcon={renderSwitcherIcon}
              onRightClick={onRightClick}
              dropIndicatorRender={({ dropLevelOffset }) => (
                <div
                  tw="absolute bg-red-10 h-0.5 bottom-0 right-0 pointer-events-none"
                  style={{ left: dropLevelOffset }}
                />
              )}
              loadData={fetchJobTreeData}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              onLoad={(keys) => {
                dtsDevStore.set({ loadedKeys: keys })
                if (autoExpandParent) {
                  setAutoExpandParent(false)
                }
              }}
              onSelect={(keys: (string | number)[], { selected, node }) => {
                if (visible) {
                  setTimeout(() => {
                    setVisible(false)
                  })
                }
                const api = get(node, 'api', null)
                if (autoExpandParent) {
                  setAutoExpandParent(false)
                }
                if (dtsDevStore.curApi?.key !== api?.key && node.isLeaf) {
                  if (verId) {
                    // 清空 query 参数
                    history.push('../serviceDev')
                  }
                  dtsDevStore.addPanel({ ...api })
                  dtsDevStore.set({
                    curApi: api,
                    showClusterErrorTip: false
                  })
                  dtsDevStore.showSaveConfirm(api.key, 'switch')
                  return
                }
                if (node.isLeaf) {
                  dtsDevStore.set({
                    curApi: cloneDeep(api)
                  })
                } else if (node.expanded) {
                  setExpandedKeys(expandedKeys.filter((key) => key !== node.key))
                } else {
                  setExpandedKeys([...expandedKeys, node.key as string])
                }

                if (selected) {
                  setSelectedKeys([String(keys[0])])
                }
              }}
            />
          </TreeWrapper>
        </Tippy>
        {showApiModal && (
          <ApiModal
            isEdit={curOp === 'editAPI'}
            currentApi={currentApi}
            currentGroup={currentGroup}
            onClose={() => setShowApiModal(false)}
          />
        )}
        {showDeleteModal && (
          <DelModal
            onClose={() => setShowDeleteModal(false)}
            currentApi={currentApi}
            currentGroup={currentGroup}
            isApiGroup={curOp === 'deleteApiGroup'}
          />
        )}
        {showApiGroupModal && (
          <ApiGroupModal
            isEdit={curOp === 'editApiGroup'}
            currentGroup={currentGroup}
            onClose={() => setShowApiGroupModal(false)}
          />
        )}
      </>
    )
  },
  { forwardRef: true }
)
export default ApiTree
