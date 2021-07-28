import React, { useRef, useState, useEffect } from 'react'
import { useMount } from 'react-use'
import { jsPlumb } from 'jsplumb'
import { useDrop } from 'react-dnd'
import { nanoid } from 'nanoid'
import clsx from 'clsx'

function FlowPainter() {
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
          stroke: '#4C5E70',
          strokeWidth: 1,
        },
        EndpointStyle: {
          fill: '#4C5E70',
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
    <div
      ref={drop}
      className={clsx(
        'tw-h-full',
        isActive ? 'tw-bg-neutral-N13 tw-bg-opacity-30' : ''
      )}
    >
      <div ref={rootEl} className="tw-relative tw-h-full">
        {elems.map((elem) => (
          <div
            key={elem.id}
            id={elem.id}
            style={{ left: elem.x, top: elem.y }}
            className={clsx(
              'tw-flex tw-h-8 tw-pl-2 tw-w-40 tw-border-l-4 tw-absolute tw-border tw-border-neutral-N13 tw-rounded  tw-bg-neutral-N16 tw-cursor-pointer tw-items-center',
              elem.type === 'table'
                ? 'tw-border-l-[#229CE9]'
                : 'tw-border-l-[#934BC5]'
            )}
          >
            <div className="tw-w-6">
              <span
                className={clsx(
                  'tw-p-1 tw-rounded-sm',
                  elem.type === 'table' ? 'tw-bg-[#229CE9]' : 'tw-bg-[#934BC5]'
                )}
              >
                {elem.type === 'table' ? 'ch' : elem.iname}
              </span>
            </div>
            <span className="tw-ml-2">{elem.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlowPainter
