import { Icon } from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import { Icons } from 'components'
import Tree from 'rc-tree'
import { useMemo, useRef, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import { flatten } from 'lodash-es'
import { useInfiniteQueryFlow } from 'hooks'
import tippy, { followCursor } from 'tippy.js'

const findNode = (treeData, pid = '') => {
  if (treeData.pid === pid) {
    return treeData
  }
  if (treeData.children) {
    return treeData.children.find((child) => findNode(child, pid))
  }
  return null
}

export const JobTree = () => {
  const [filter] = useImmer({
    search: '',
    offset: 0,
    limit: 100,
    pid: '',
    reverse: true,
  })

  const treeEl = useRef(null)
  const [instance, setInstance] = useState(null)

  const flowsRet = useInfiniteQueryFlow(filter, { enabled: false })
  if (flowsRet.isSuccess) {
    if (flowsRet.hasNextPage) {
      flowsRet.fetchNextPage()
    }
  }

  const flows = flatten(flowsRet.data?.pages.map((page) => page.infos || []))

  const treeData = useMemo(() => {
    const rootData = [
      {
        key: 'di-root',
        title: '数据集成',
        pid: '',
      },
      {
        key: 'rt-root',
        title: '实时-流式开发',
        pid: '',
      },
    ]

    const pNode = findNode(rootData[1], filter.pid)
    const children = flows.map((flow) => ({
      key: flow.id,
      title: flow.name,
      pid: flow.pid,
      isLeaf: !flow.is_directory,
    }))
    pNode.children = children

    return rootData
  }, [filter.pid, flows])

  const onRightClick = () => {
    if (instance) {
      instance.hide()

      setTimeout(() => {
        instance.show()
      }, 300)
    }
  }

  useEffect(() => {
    if (treeEl?.current) {
      const inst = tippy(treeEl.current, {
        trigger: 'manual',
        content: 'xxxxxxxx',
        placement: 'right',
        followCursor: 'initial',
        interactive: true,
        plugins: [followCursor],
      })
      setInstance(inst)
    }
  }, [])
  return (
    <div tw="relative" ref={treeEl}>
      <Tree
        treeData={treeData}
        tw="ml-2"
        icon={(props) => {
          const { data, loading } = props
          if (loading) {
            return <Loading size={16} />
          }
          if (data?.children?.length) {
            return <Icons name="folder" size={16} />
          }
          return <Icons name="sql" size={16} />
        }}
        switcherIcon={(props) => {
          const { expanded, isLeaf } = props
          if (isLeaf) {
            return null
          }
          return (
            <Icon
              name={expanded ? 'chevron-up' : 'chevron-down'}
              type="light"
            />
          )
        }}
        onRightClick={onRightClick}
        draggable={(props) => {
          const { key } = props
          if (key === 'key-0' || key === 'key-1') {
            return false
          }
          return true
        }}
        dropIndicatorRender={({ dropLevelOffset }) => {
          return (
            <div
              tw="absolute bg-red-10 h-0.5 right-0 pointer-events-none"
              style={{ left: dropLevelOffset }}
            />
          )
        }}
        loadData={() => {
          // if (key === 'rt-root') {
          //   setFilter((draft) => {
          //     draft.pid = ''
          //   })
          //   return flowsRet.refetch()
          // }
          // return flowsRet.refetch()
          return new Promise((resolve) => {
            flowsRet.refetch().then(() => {
              resolve()
            })
          })
        }}
      />
    </div>
  )
}
export default JobTree
