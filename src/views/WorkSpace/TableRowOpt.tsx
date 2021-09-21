import { Link } from 'react-router-dom'
import { useStore } from 'stores'
import { Tooltip, Icon, Menu, Dropdown } from '@QCFE/lego-ui'
import { useWorkSpaceContext } from 'contexts'

const { MenuItem } = Menu

const TableRowOpt = ({ space, regionId }) => {
  const stateStore = useWorkSpaceContext()
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const handleClick = (e, key, value: string) => {
    stateStore.set({ curSpaceOpt: value, optSpaces: [space] })
  }
  return (
    <div tw="flex justify-center items-center space-x-1 2xl:space-x-2">
      {funcList.map(({ name: funcName, title, subFuncList }) => (
        <Tooltip
          trigger="hover"
          key={funcName}
          content={subFuncList.map((subFunc) => (
            <Link
              key={subFunc.name}
              to={`${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
              tw="flex items-center py-2 px-5 (text-white no-underline)! hover:(bg-neut-15 )"
            >
              <Icon name={subFunc.icon} type="light" />
              {subFunc.title}
            </Link>
          ))}
          placement="bottom"
        >
          <Link
            to={`${regionId}/workspace/${space.id}/${funcName}`}
            tw="hover:text-green-11 inline-block"
          >
            <button
              type="button"
              tw="font-semibold text-xs rounded-sm text-neut-13  bg-neut-1 border border-neut-3 px-2 2xl:px-3 py-1 focus:outline-none hover:text-green-11 hover:bg-green-0 hover:border-green-11 hover:shadow transition-colors"
            >
              {title}
            </button>
          </Link>
        </Tooltip>
      ))}

      <Dropdown
        content={
          <Menu onClick={handleClick}>
            <MenuItem value="update">
              <Icon name="pen" />
              修改工作空间
            </MenuItem>
            <MenuItem value="disable" disabled={space.status === 2}>
              <i className="if if-minus-square" tw="text-base mr-2" />
              禁用工作空间
            </MenuItem>
            <MenuItem value="enable" disabled={space.status === 1}>
              <Icon name="start" />
              启动工作空间
            </MenuItem>
            <MenuItem value="delete">
              <Icon name="trash" />
              删除
            </MenuItem>
          </Menu>
        }
      >
        <Icon name="more" clickable changeable size={18} />
      </Dropdown>
    </div>
  )
}

export default TableRowOpt
