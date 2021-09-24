import tw from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import NodeMenuItem from './NodeMenuItem'

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

const NodeMenu = ({ show }: { show: boolean }) => {
  return (
    <div
      css={[
        tw`bg-neut-16 text-white py-3 w-40 rounded-sm shadow-sm`,
        show ? tw`hidden` : '',
      ]}
    >
      {menusData.map((menu, i) => (
        <div key={menu.name}>
          <div tw="leading-7 bg-neut-13 flex items-center justify-between px-2 cursor-pointer">
            <div tw="flex items-center">
              <Icon name={menu.icon} type="light" />
              <span tw="ml-1">{menu.name}</span>
            </div>
            <Icon name="caret-down" type="light" />
          </div>
          <ul tw="py-3 leading-7">
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

export default NodeMenu
