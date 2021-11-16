import { Link } from 'react-router-dom'
import { useStore } from 'stores'
import { Icon, Menu } from '@QCFE/lego-ui'
import { useWorkSpaceContext } from 'contexts'
import { Tooltip } from 'components'
import { OptButton } from './styled'

const { MenuItem } = Menu

const TableRowOpt = ({ space, regionId }: { space: any; regionId: string }) => {
  const stateStore = useWorkSpaceContext()
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const handleClick = (e: React.SyntheticEvent, key, value: string) => {
    stateStore.set({ curSpaceOpt: value, optSpaces: [space] })
  }
  return (
    <div tw="flex justify-center items-center space-x-1 2xl:space-x-2">
      {funcList.map(({ name: funcName, title, subFuncList }) => (
        <Tooltip
          key={funcName}
          theme="darker"
          placement="bottom-start"
          appendTo={() => document.body}
          content={subFuncList.map((subFunc) => (
            <Link
              key={subFunc.name}
              to={`${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
              tw="flex items-center space-x-1 py-2 px-5 (text-white no-underline)! hover:(bg-neut-15 )"
            >
              <Icon name={subFunc.icon} type="light" />
              <span>{subFunc.title}</span>
            </Link>
          ))}
        >
          <Link
            to={`${regionId}/workspace/${space.id}/${funcName}`}
            tw="hover:text-green-11 inline-block"
          >
            <OptButton>{title}</OptButton>
          </Link>
        </Tooltip>
      ))}
      <Tooltip
        theme="light"
        trigger="click"
        placement="bottom-start"
        arrow={false}
        appendTo={() => document.body}
        content={
          <div>
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
          </div>
        }
      >
        <div>
          <Icon name="more" clickable changeable size={18} />
        </div>
      </Tooltip>

      {/* <Dropdown
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
      </Dropdown> */}
    </div>
  )
}

export default TableRowOpt
