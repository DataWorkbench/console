import { useRef, useState, useCallback, useEffect, useImperativeHandle } from 'react'
import { observer } from 'mobx-react-lite'
import { Icon, Menu } from '@QCFE/lego-ui'
import { Tree } from 'components'
import tw, { css, styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useFetchApi } from 'hooks'
import { followCursor } from 'tippy.js'
import Tippy from '@tippyjs/react'
import { useUnmount } from 'react-use'
import { cloneDeep, get } from 'lodash-es'
import { useStore } from 'stores'
import { TreeNodeProps } from 'rc-tree'
import { useParams } from 'react-router-dom'
import { JobType, getNewTreeData, renderIcon, renderSwitcherIcon } from './ApiUtils'
import ApiModal from '../Modal/ApiModal'
import DelModal from '../Modal/DelModal'

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

interface JobTreeProps {
  expandedKeys?: string[]
}

export const ApiTree = observer(
  (props: JobTreeProps, ref) => {
    const { expandedKeys: expandedKeysProp } = props
    const { spaceId } = useParams<{ spaceId: string }>()
    const fetchApi = useFetchApi()

    const {
      dtsDevStore,
      dtsDevStore: { treeData, loadedKeys }
    } = useStore()

    const [expandedKeys, setExpandedKeys] = useState<string[]>(expandedKeysProp || [])
    const [curOpNode, setCurOpNode] = useState(treeData[1])
    const [autoExpandParent, setAutoExpandParent] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const treeEl = useRef(null)
    const [visible, setVisible] = useState<any>(null)
    const [curOp, setCurOp] = useState<string>('')
    const [showApiModal, setShowApiModal] = useState<boolean>()
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>()

    const [search, setSearch] = useState('')
    const [jobInfo, setJobInfo] = useImmer<{
      op: 'create' | 'edit'
      type?: JobType
      node?: TreeNodeProps
    }>({
      op: 'create',
      type: JobType.OFFLINE,
      node: undefined
    })

    // const mutation = useMutationStreamJob()

    console.log(curOpNode, jobInfo)

    useUnmount((): void => {
      dtsDevStore.resetTreeData()
    })

    useEffect(() => {
      setExpandedKeys(expandedKeysProp || [])
    }, [expandedKeysProp])

    // useEffect(() => {
    //   if (dtsStore.curApi) {
    //     setSelectedKeys([dtsStore.curApi.id])
    //   }
    // }, [dtsStore.curApi])

    useImperativeHandle(ref, () => ({
      reset: () => {
        setJobInfo({
          op: 'create',
          type: JobType.OFFLINE,
          node: undefined
        })
      },
      search: (v: string) => {
        dtsDevStore.resetTreeData()
        setSearch(v)
        setExpandedKeys(['di-root', 'rt-root'])
      }
    }))

    const onRightClick = useCallback(({ node }) => {
      setCurOpNode(node)
      setVisible(false)
      setTimeout(() => {
        setVisible(true)
      }, 200)
    }, [])

    const onRightMenuClick = useCallback((e, key: string, val: string | number) => {
      setCurOp(val)
      if (val === 'createAPI') {
        setShowApiModal(true)
      } else if (val === 'deleteApiGroup') {
        setShowDeleteModal(true)
      } else if (val === 'deleteApi') {
        setShowDeleteModal(true)
      }
      setVisible(false)
    }, [])

    const fetchJobTreeData = (node: any, movingNode = null) => {
      const rootKey = node.key === node.pid ? node.key : node.rootKey
      return fetchApi({
        group_id: rootKey,
        search
      })
        .then((data) => {
          const apis = get(data, 'infos', [])
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
            <Menu onClick={onRightMenuClick}>
              <MenuItem value="createAPI">
                <Icon name="edit" size={14} type="light" />
                <span>创建API</span>
              </MenuItem>
              <MenuItem value="deleteApiGroup">
                <Icon name="delete" size={14} type="light" />
                <span>删除</span>
              </MenuItem>
            </Menu>
          )
        }
        return (
          <Menu onClick={onRightMenuClick}>
            <MenuItem value="createAPI">
              <Icon name="edit" size={14} type="light" />
              <span>编辑信息</span>
            </MenuItem>
            <MenuItem value="delete">
              <Icon name="delete" size={14} type="light" />
              <span>服务集群</span>
            </MenuItem>
            <MenuItem value="delete">
              <Icon name="delete" size={14} type="light" />
              <span>请求参数</span>
            </MenuItem>
            <MenuItem value="delete">
              <Icon name="delete" size={14} type="light" />
              <span>返回参数</span>
            </MenuItem>
            <MenuItem value="delete">
              <Icon name="delete" size={14} type="light" />
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
                if (dtsDevStore.curApi?.api_id !== api?.api_id && node.isLeaf) {
                  dtsDevStore.addPanel({ ...api })
                  dtsDevStore.set({ curApi: api })
                  dtsDevStore.showSaveConfirm(api.api_id, 'switch')
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
        {showApiModal && <ApiModal onClose={() => setShowApiModal(false)} />}
        {showDeleteModal && (
          <DelModal
            onClose={() => setShowDeleteModal(false)}
            isApiGroup={curOp === 'deleteApiGroup'}
          />
        )}
      </>
    )
  },
  { forwardRef: true }
)
export default ApiTree
