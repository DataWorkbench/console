import React, { useRef, useState, useEffect } from 'react'
import { useMount } from 'react-use'
import { newInstance, ready } from '@jsplumb/browser-ui'
import { useDrop } from 'react-dnd'
import clsx from 'clsx'

function FlowPainter() {
  const [rjsp, setRjsp] = useState(null)
  const [elems, setElems] = useState([])
  const rootEl = useRef()
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop: (item) => {
        setElems([...elems, item])
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
    ready(() => {
      const instance = newInstance({
        dragOptions: { cursor: 'pointer', zIndex: 2000 },
        Connector: ['Bezier', { curviness: 150 }],
        Anchors: ['TopCenter', 'BottomCenter'],
        connectionOverlays: [
          {
            type: 'Arrow',
            options: {
              location: 1,
              visible: true,
              width: 11,
              length: 11,
              id: 'ARROW',
              events: {
                click() {
                  // alert('you clicked on the arrow overlay')
                },
              },
            },
          },
          {
            type: 'Label',
            options: {
              location: 0.3,
              id: 'label',
              cssClass: 'aLabel',
              events: {
                click() {
                  // alert('hey')
                },
              },
            },
          },
        ],
        container: rootEl.current,
      })

      setRjsp(instance)

      // const curEl = document.getElementById('flowChart0')

      // instance.addEndpoint(curEl)
      // instance.setDraggable(curEl, true)
    })
  })

  useEffect(() => {
    if (rjsp) {
      elems.forEach((elem, i) => {
        rjsp.addEndpoint(document.getElementById(`${elem.id}-${i}`))
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
      <div ref={rootEl} className="tw-relative  tw-h-full">
        {elems.map((elem, idx) => (
          <div
            key={elem.id}
            id={`${elem.id}-${idx}`}
            className="tw-flex tw-absolute tw-border tw-border-neutral-N13 tw-rounded tw-px-2 tw-bg-neutral-N16 tw-py-1.5 tw-cursor-pointer tw-w-20 tw-items-center"
          >
            {elem.name}
          </div>
        ))}
      </div>
    </div>
  )
}

FlowPainter.propTypes = {}

export default FlowPainter
