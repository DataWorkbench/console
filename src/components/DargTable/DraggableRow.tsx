import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import tw, { css, styled } from 'twin.macro'
import { FlexBox } from 'components/Box'

interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
  type: string
}

const Row = styled(FlexBox)(() => [
  tw`px-3 py-1.5 items-center h-11`,
  css`
    &:hover {
      ${tw`dark:bg-[#1E2F41] border-[1px]! border-neut-13! border-solid!`}
    }
    .icon svg {
      ${tw`dark:text-white dark:fill-[#fff6]`}
    }
  `
])

const DraggableRow = ({
  index,
  moveRow,
  type,
  className,
  style,
  ...restProps
}: DraggableBodyRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: { getItem: () => {}; isOver: () => any }) => {
      // @ts-ignore
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward'
      }
    },
    drop: (item: { index: number }) => {
      moveRow(item.index, index)
    }
  })

  const [, drag, dragPreview] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  })
  drop(drag(ref))

  return (
    <div ref={ref}>
      <Row
        ref={dragPreview}
        className={`table-row ${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move', ...style }}
        {...restProps}
      />
    </div>
  )
}

export default DraggableRow
