import { useRef, useState, useCallback, useEffect, useImperativeHandle } from 'react'
import { observer } from 'mobx-react-lite'
import { Icon, Menu } from '@QCFE/lego-ui'
import { Tree } from 'components'
import tw, { css, styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useMutationStreamJob, useFetchJob } from 'hooks'
import { followCursor } from 'tippy.js'
import Tippy from '@tippyjs/react'
import { useUnmount } from 'react-use'
import { get } from 'lodash-es'
import { useStore } from 'stores'
import { TreeNodeProps } from 'rc-tree'
import { useParams } from 'react-router-dom'
import {
  JobType,
  RootKey,
  getNewTreeData,
  getJobIdByKey,
  renderIcon,
  renderSwitcherIcon
} from './JobUtils'

const { MenuItem } = Menu

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

export const JobTree = observer(
  (props: JobTreeProps, ref) => {
    const { expandedKeys: expandedKeysProp } = props
    const { spaceId } = useParams<{ spaceId: string }>()
    const fetchJob = useFetchJob()

    const {
      dtsStore,
      dtsStore: { APItreeData, loadedKeys }
    } = useStore()

    const [expandedKeys, setExpandedKeys] = useState<string[]>(expandedKeysProp || [])
    const [curOpNode, setCurOpNode] = useState(APItreeData[1])
    const [autoExpandParent, setAutoExpandParent] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const treeEl = useRef(null)
    const [visible, setVisible] = useState<any>(null)
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

    const mutation = useMutationStreamJob()

    console.log(mutation, curOpNode, jobInfo)

    useUnmount((): void => {
      dtsStore.resetTreeData()
    })

    useEffect(() => {
      setExpandedKeys(expandedKeysProp || [])
    }, [expandedKeysProp])

    // useEffect(() => {
    //   if (dtsStore.curJob) {
    //     setSelectedKeys([dtsStore.curJob.id])
    //   }
    // }, [dtsStore.curJob])

    useImperativeHandle(ref, () => ({
      reset: () => {
        setJobInfo({
          op: 'create',
          type: JobType.OFFLINE,
          node: undefined
        })
      },
      search: (v: string) => {
        dtsStore.resetTreeData()
        setSearch(v)
        setExpandedKeys(['di-root', 'rt-root'])
      }
    }))

    const onRightClick = useCallback(({ node }) => {
      console.log(node)

      setCurOpNode(node)
      setVisible(false)
      setTimeout(() => {
        setVisible(true)
      }, 200)
    }, [])

    const onRightMenuClick = useCallback((e, key: string, val: string | number) => {
      console.log(e, key, val)
    }, [])

    const fetchJobTreeData = (node: any, movingNode = null) => {
      const pid = getJobIdByKey(node.key)
      const rootKey = node.key === node.pid ? node.key : node.rootKey
      return fetchJob(rootKey === RootKey.DI ? 'sync' : 'stream', {
        pid,
        search
      })
        .then((data) => {
          const jobs = get(data, 'infos') || []
          const newTreeData = getNewTreeData(dtsStore.APItreeData, node, jobs, movingNode)
          dtsStore.set({
            APItreeData: newTreeData
          })
          setExpandedKeys([...expandedKeys, node.key])
        })
        .catch((e) => {
          setExpandedKeys(expandedKeys.filter((key) => key !== node.key))
          throw e
        })
    }

    useEffect(() => {
      dtsStore.resetTreeData()
    }, [spaceId, dtsStore])

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
          content={
            <div tw="border border-neut-13 rounded-sm">
              <Menu onClick={onRightMenuClick}>
                <MenuItem value="createAPI">
                  <Icon name="edit" size={14} type="light" />
                  <span>创建API</span>
                </MenuItem>
              </Menu>
            </div>
          }
        >
          <TreeWrapper ref={treeEl}>
            <Tree
              autoExpandParent={autoExpandParent}
              treeData={APItreeData}
              loadedKeys={loadedKeys}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              icon={renderIcon}
              switcherIcon={renderSwitcherIcon}
              onRightClick={onRightClick}
              // draggable={(dragNode) => {
              //   const { key } = dragNode
              //   if (isRootNode(String(key))) {
              //     return false
              //   }
              //   return true
              // }}
              dropIndicatorRender={({ dropLevelOffset }) => (
                <div
                  tw="absolute bg-red-10 h-0.5 bottom-0 right-0 pointer-events-none"
                  style={{ left: dropLevelOffset }}
                />
              )}
              loadData={fetchJobTreeData}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              onLoad={(keys) => {
                dtsStore.set({ loadedKeys: keys })
                if (autoExpandParent) {
                  setAutoExpandParent(false)
                }
              }}
              onSelect={(keys: (string | number)[], { selected, node }) => {
                const job = get(node, 'job')
                console.log(job)

                if (autoExpandParent) {
                  setAutoExpandParent(false)
                }
                // if (
                //   dtsStore.curJob?.id !== job?.id &&
                //   dtsStore.isDirty
                // ) {
                //   dtsStore.set({ nextJob: job })
                //   dtsStore.showSaveConfirm(job.id, 'switch')
                //   return
                // }
                if (node.isLeaf) {
                  dtsStore.set({
                    curJob: { ...job, jobMode: get(node, 'jobMode') }
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
      </>
    )
  },
  { forwardRef: true }
)
export default JobTree
