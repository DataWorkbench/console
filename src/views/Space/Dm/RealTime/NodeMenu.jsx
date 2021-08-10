import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import NodeMenuItem from './NodeMenuItem'

const propTypes = {
  show: PropTypes.bool,
}

const menusData = [
  {
    name: '数据源',
    icon: 'blockchain',
    items: [
      { name: '数据表1', type: 'table', id: 'table1' },
      { name: '数据表2', type: 'table', id: 'table2' },
      { name: '数据表3', type: 'table', id: 'table3' },
    ],
  },
  {
    name: '通用节点',
    icon: 'os-service',
    items: [
      { iname: 'Em', name: '空节点', type: 'node', id: 'node0' },
      { iname: 'Ud', name: 'UDF', type: 'node', id: 'node1' },
      { iname: 'Or', name: 'Order by', type: 'node', id: 'node2' },
      { iname: 'Li', name: 'Limit', type: 'node', id: 'node3' },
      { iname: 'Of', name: 'Offset', type: 'node', id: 'node4' },
      { iname: 'FE', name: 'Fetch', type: 'node', id: 'node5' },
      { iname: 'Jo', name: 'Join', type: 'node', id: 'node6' },
      { iname: 'Un', name: 'Union', type: 'node', id: 'node7' },
      { iname: 'Ex', name: 'Except', type: 'node', id: 'node8' },
      { iname: 'Int', name: 'Intersect', type: 'node', id: 'node9' },
      { iname: 'Gr', name: 'Group by', type: 'node', id: 'node10' },
      { iname: 'Ha', name: 'Having', type: 'node', id: 'node11' },
      { iname: 'Wi', name: 'Windows', type: 'node', id: 'node12' },
      { iname: 'Va', name: 'Values', type: 'node', id: 'node13' },
      { iname: 'Wh', name: 'Where', type: 'node', id: 'node14' },
      { iname: 'Ch', name: '常量节点', type: 'node', id: 'node15' },
    ],
  },
]

function NodeMenu({ show }) {
  return (
    <div
      className={clsx(
        'tw-bg-neut-16 tw-text-white tw-py-3 tw-w-40 tw-rounded-sm tw-shadow-sm',
        show ? 'tw-hidden' : ''
      )}
    >
      {menusData.map((menu, i) => (
        <div key={menu.name}>
          <div className="tw-leading-7 tw-bg-neut-13 tw-flex tw-items-center tw-justify-between tw-px-2 tw-cursor-pointer">
            <div className="tw-flex tw-items-center">
              <Icon name={menu.icon} type="light" />
              <span className="tw-ml-1">{menu.name}</span>
            </div>
            <Icon name="caret-down" type="light" />
          </div>
          <ul className="tw-py-3 tw-leading-7">
            {menu.items.map((item) => (
              <NodeMenuItem
                key={item.name}
                item={item}
                type={i === 0 ? 'datasource' : ''}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

NodeMenu.propTypes = propTypes

export default NodeMenu
