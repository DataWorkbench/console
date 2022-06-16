import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import tw, { css, styled } from 'twin.macro'
import { FlexBox } from 'components/Box'

interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
  type: string
}

export const Row = styled(FlexBox)(() => [
  tw`items-center h-11 border-b-[1px]! border-neut-13! border-solid!`,
  css`
    &:hover {
      ${tw`dark:bg-[#1E2F41] border-b-[1px]! border-neut-13! border-solid!`}
    }
    .icon svg {
      ${tw`dark:text-white dark:fill-[#fff6]`}
    }
  `
])

/**
 *  可拖拽行
 * @param index 行索引
 * @param moveRow 拖拽回调
 * @param type 拖拽类型
 * @param props 其他属性
 * @returns
 */
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
