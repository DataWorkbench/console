import { useRef, useState, useEffect } from 'react'
import { useMount } from 'react-use'
import { Icon } from '@QCFE/lego-ui'
import { Button } from '@QCFE/qingcloud-portal-ui'
import { jsPlumb } from 'jsplumb'
import { useDrop } from 'react-dnd'
import { nanoid } from 'nanoid'
import tw, { theme } from 'twin.macro'
import NodeMenu from './NodeMenu'

const StreamOperator = ({ className }: { className?: string }) => {
  // console.log(props)
  const [rjsp, setRjsp] = useState(null)
  const [elems, setElems] = useState([])
  const rootEl = useRef()
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop: (item, monitor) => {
        const rect = rootEl.current.getBoundingClientRect()
        const offset = monitor.getSourceClientOffset()
        const x = offset.x - rect.x
        const y = offset.y - rect.y
        setElems([
          ...elems,
          { ...item, x: x > 0 ? x : 0, y: y > 0 ? y : 0, id: nanoid() },
        ])
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [elems]
  )
  const isActive = canDrop && isOver

  useMount(() => {
    jsPlumb.ready(() => {
      const instance = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        Anchors: ['Top', 'Bottom'],
        PaintStyle: {
          stroke: theme('colors.line.dark'),
          strokeWidth: 1,
        },
        EndpointStyle: {
          fill: theme('colors.line.dark'),
          stroke: '#939EA9',
          radius: 3,
        },
        Container: rootEl.current,
        Connector: ['Bezier', { curviness: 30 }],
      })
      setRjsp(instance)
    })
  })

  useEffect(() => {
    if (rjsp && elems.length > 0) {
      const { id } = elems[elems.length - 1]
      rjsp.draggable(id, { force: true })
      const anchors = ['Top', 'Bottom']
      anchors.forEach((anchor) => {
        rjsp.addEndpoint(id, {
          anchor,
          maxConnections: -1,
          isSource: true,
          isTarget: true,
        })
      })
    }
  }, [elems, rjsp])
  return (
    <div className={className} tw="flex flex-col text-white relative">
      <div tw="flex px-2 pt-4 space-x-2">
        <div tw="relative">
          <Button type="black">
            <div tw="mr-2">
              <Icon name="apps" type="light" tw="align-middle" />
              <span>节点库</span>
            </div>
            <Icon name="caret-down" type="light" />
          </Button>
        </div>
        <Button type="black">
          <Icon name="eye" type="dark" />
          <span>预览</span>
        </Button>
        <Button type="black">
          <Icon name="remark" type="dark" />
          <span>语法检查</span>
        </Button>
        <Button type="black">
          <Icon name="start" type="light" />
          <span>运行</span>
        </Button>
        <Button>
          <Icon name="data" type="dark" />
          <span>保存</span>
        </Button>
        <Button type="primary">
          <Icon name="export" />
          <span>发布</span>
        </Button>
      </div>
      <div
        ref={drop}
        css={[tw`flex-1`, isActive && tw`bg-neut-13 bg-opacity-30`]}
      >
        <div ref={rootEl} tw="relative h-full">
          {elems.map((elem) => (
            <div
              key={elem.id}
              id={elem.id}
              style={{ left: elem.x, top: elem.y }}
              css={[
                tw`flex h-8 pl-2 w-40 border-l-4 absolute border border-neut-13 rounded  bg-neut-16 cursor-pointer items-center`,
                elem.type === 'table'
                  ? tw`border-l-[#229CE9]`
                  : tw`border-l-[#934BC5]`,
              ]}
            >
              <div tw="w-6">
                <span
                  css={[
                    tw`p-1 rounded-sm`,
                    elem.type === 'table' ? tw`bg-[#229CE9]` : tw`bg-[#934BC5]`,
                  ]}
                >
                  {elem.type === 'table' ? 'ch' : elem.iname}
                </span>
              </div>
              <span tw="ml-2">{elem.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div tw="pt-2 absolute top-12 left-2 bottom-2 min-h-[450px]  overflow-y-auto">
        <NodeMenu show />
      </div>
    </div>
  )
}

export default StreamOperator
