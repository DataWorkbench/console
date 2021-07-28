import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'

const propTypes = {
  item: PropTypes.object,
}

function NodeMenuItem({ item }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    options: {
      dropEffect: 'copy',
    },
    item,
    // end: (item, monitor) => {
    //   const dropResult = monitor.getDropResult()
    //   console.log(item, dropResult)
    // },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  return (
    <li
      ref={drag}
      className={clsx(
        'tw-pl-2 tw-flex tw-cursor-pointer hover:tw-bg-neutral-N13',
        isDragging ? 'tw-opacity-50' : ''
      )}
    >
      <div className="tw-w-6">
        <span
          className={clsx(
            'tw-p-1 tw-rounded-sm',
            item.type === 'table' ? 'tw-bg-[#229CE9]' : 'tw-bg-[#934BC5]'
          )}
        >
          {item.type === 'table' ? 'ch' : item.iname}
        </span>
      </div>
      <span className="tw-ml-2">{item.name}</span>
    </li>
  )
}

NodeMenuItem.propTypes = propTypes

export default NodeMenuItem
