import { Interpolation, Theme } from '@emotion/react'
import { AnchorSpec, Endpoint, jsPlumbInstance } from 'jsplumb'
import { noop } from 'lodash-es'
import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import { useUnmount } from 'react-use'
import tw from 'twin.macro'

export type TMappingField = {
  type: string
  name: string
  is_primary_key?: boolean
}

export type DragItem = TMappingField & { id: string | number; index: number }

interface MappingItemProps {
  anchor: AnchorSpec
  item: TMappingField
  index: number
  css: Interpolation<Theme>
  className?: string
  jsplumb?: jsPlumbInstance
  hasConnection?: boolean
  moveItem?: (dragId: string, hoverId: string, isTop: boolean) => void
}

const MappingItem = (props: PropsWithChildren<MappingItemProps>) => {
  const ref = useRef<HTMLDivElement>(null)
  const {
    jsplumb,
    anchor,
    index,
    item,
    children,
    className,
    hasConnection,
    moveItem = noop,
  } = props
  const [isTop, setIsTop] = useState(false)
  const endPointRef = useRef<Endpoint | null>(null)
  const dndType = String(anchor)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: dndType,
      item: { ...item, id: item.name, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => !hasConnection,
    }),
    [item.name, index, hasConnection]
  )

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: dndType,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover({ index: dragIndex }, monitor) {
      if (!ref.current) {
        return
      }
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (
        dragIndex > hoverIndex &&
        hoverClientY < hoverMiddleY &&
        hoverIndex === 0
      ) {
        setIsTop(true)
      } else {
        setIsTop(false)
      }
    },
    drop({ id: draggedId }: DragItem) {
      if (!ref.current) {
        return
      }
      moveItem(draggedId, item.name, isTop)
    },
  })

  useEffect(() => {
    if (ref.current && jsplumb) {
      const endPoint = endPointRef.current
      if (endPoint) {
        jsplumb.deleteEndpoint(endPoint)
      }
      endPointRef.current = jsplumb.addEndpoint(ref.current, {
        anchor,
        parameters: { [String(anchor)]: item },
        isSource: anchor !== 'Left',
        isTarget: anchor === 'Left',
        connectorStyle: {
          gradient: {
            stops: [
              [0, '#229CE9'],
              [1, '#15A675'],
            ],
          },
          strokeWidth: 2,
          stroke: '#fff',
        },
        connectorHoverStyle: {
          strokeWidth: 4,
        },
        endpoint: [
          'Dot',
          {
            cssClass: `point-${anchor}`,
            radius: 6,
          },
        ],
        paintStyle: {
          fill: anchor === 'Left' ? '#9DDFC9' : '#BAE6FD',
          stroke: '#fff',
          strokeWidth: 2,
        },
        'connector-pointer-events': 'visible',
        uuid: `${anchor}-${item.name}`,
      } as any) as Endpoint
    }
  }, [item, jsplumb, anchor])

  useUnmount(() => {
    const endPoint = endPointRef.current
    if (jsplumb && endPoint) {
      jsplumb.deleteEndpoint(endPoint)
    }
  })

  drag(drop(ref))
  // console.log('isOver', isOver, 'isTop', isTop)
  const isOverTop = isOver && isTop
  const isOverOthers = isOver && !isTop
  return (
    <div
      className={className}
      css={[
        isDragging && tw`bg-green-4/10!`,
        isOver && tw`border-dashed`,
        isOverTop && tw`(border-t-green-11 border-t-2)!`,
        isOverOthers && tw`(border-b-green-11 border-b-2)!`,
      ]}
      ref={ref}
    >
      {children}
    </div>
  )
}

export default MappingItem
