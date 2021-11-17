import { Link } from 'react-router-dom'
import { useStore } from 'stores'
import { Icon, Menu } from '@QCFE/lego-ui'
import tw from 'twin.macro'
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
  const disableStatus = space.status === 2
  return (
    <div tw="flex justify-center items-center space-x-1 2xl:space-x-2">
      {funcList.map(({ name: funcName, title, subFuncList }) => (
        <Tooltip
          key={funcName}
          theme="light"
          disabled={disableStatus}
          placement="bottom-start"
          content={subFuncList.map((subFunc) => (
            <Link
              key={subFunc.name}
              to={`${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
              tw="flex items-center space-x-1 py-2 px-5 (text-neut-15 no-underline)! hover:(bg-neut-1 text-current)"
            >
              <Icon name={subFunc.icon} />
              <span>{subFunc.title}</span>
            </Link>
          ))}
        >
          <Link
            to={`${regionId}/workspace/${space.id}/${funcName}`}
            css={disableStatus && tw`pointer-events-none`}
          >
            <OptButton disabled={disableStatus}>{title}</OptButton>
          </Link>
        </Tooltip>
      ))}
      <Tooltip
        theme="light"
        trigger="click"
        placement="bottom-start"
        arrow={false}
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
        <Icon name="more" clickable changeable size={18} tw="align-middle" />
      </Tooltip>
    </div>
  )
}

export default TableRowOpt
