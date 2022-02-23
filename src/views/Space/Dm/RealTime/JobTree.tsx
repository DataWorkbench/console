import { Icon } from '@QCFE/lego-ui'
import { Icons } from 'components'
import Tree from 'rc-tree'
import { useMemo } from 'react'

export const JobTree = () => {
  const treeData = useMemo(() => {
    return [
      {
        key: 'key-0',
        title: '数据集成',
        icon: <Icons name="equalizer" size={16} />,
        children: [
          {
            key: 'key-0-0',
            title: '一级子目录 Demo1',
            children: [
              {
                key: 'key-0-0-0',
                icon: <Icons name="inbox0" size={16} />,
                title: '实时同步作业 01',
              },
              {
                key: 'key-0-0-1',
                icon: <Icons name="inbox1" size={16} />,
                title: '离线同步作业 02',
              },
            ],
          },
          {
            key: 'key-0-1',
            title: '一级子目录 Demo2',
            children: [
              {
                key: 'key-0-1-0',
                title: '二级子目录 Demo3',
                children: [
                  {
                    key: 'key-0-1-0-0',
                    icon: <Icons name="inbox1" size={16} />,
                    title: '离线同步作业 03',
                  },
                ],
              },
            ],
          },
          {
            key: 'key-0-2',
            icon: <Icons name="inbox0" size={16} />,
            title: '离线同步作业 04',
            isLeaf: true,
          },
        ],
      },
      {
        key: 'key-1',
        icon: <Icons name="flash" size={16} />,
        title: '实时-流式开发',
      },
    ]
  }, [])
  return (
    <Tree
      treeData={treeData}
      // draggable
      tw="ml-2"
      icon={({ data }) => {
        if (data?.children?.length) {
          return <Icons name="folder" size={16} />
        }
        return null
      }}
      switcherIcon={(props) => {
        const { expanded, isLeaf } = props
        if (!isLeaf) {
          return (
            <Icon
              name={expanded ? 'chevron-up' : 'chevron-down'}
              type="light"
            />
          )
        }
        return null
      }}
      draggable={(props) => {
        const { key } = props
        if (key === 'key-0' || key === 'key-1') {
          return false
        }
        return true
      }}
      dropIndicatorRender={({ dropLevelOffset }) => {
        // console.log(props)
        return (
          <div
            tw="absolute bg-red-10 h-0.5 right-0 pointer-events-none"
            style={{ left: dropLevelOffset }}
          />
        )
      }}
    />
  )
}
export default JobTree
