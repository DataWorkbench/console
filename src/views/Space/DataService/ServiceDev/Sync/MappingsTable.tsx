import { useCallback, useRef, useState } from 'react'
import tw from 'twin.macro'
import { Table } from '@QCFE/lego-ui'
import update from 'immutability-helper'
import { useDrag, useDrop } from 'react-dnd'

const styles = {
  wrapper: tw`border flex-1 border-neut-13`,
  fieldType: tw`w-44 pl-5 xl:pl-12`,
  row: tw`flex border-b border-neut-13 last:border-b-0 p-1.5`,
  // row: tw`grid grid-template-columns[1fr 1.5fr 48px] text-left border-b border-neut-13 last:border-b-0 p-1.5`,
  header: tw`bg-neut-16`,
  rowbody: tw`hover:bg-[#1E2F41]`,
  // column: tw`w-44`,
  add: tw`bg-neut-16 text-white`
}
interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  }
]

const type = 'DraggableBodyRow'

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}: DraggableBodyRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: { getItem: () => {}; isOver: () => any }) => {
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
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  drop(drag(ref))

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  )
}

const MappingsTable = () => {
  const [data, setData] = useState([
    {
      key: '1',
      name: 'John Brown',
      age: 1,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 2,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 3,
      address: 'Sidney No. 1 Lake Park'
    }
  ])

  const components = {
    body: {
      row: DraggableBodyRow
    }
  }

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = data[dragIndex]
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow]
          ]
        })
      )
    },
    [data]
  )

  return (
    <div css={styles.wrapper}>
      <Table
        columns={columns}
        dataSource={data}
        components={components}
        onRow={(_, index) => {
          const attr = {
            index,
            moveRow
          }
          return attr as React.HTMLAttributes<any>
        }}
      />
    </div>
  )
}

export default MappingsTable
