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
  const disableStatus = space.status === 2
  return (
    <div tw="flex justify-center items-center space-x-1 2xl:space-x-2">
      {funcList.map(({ name: funcName, title, subFuncList }) => (
        <Tooltip
          key={funcName}
          theme={disableStatus ? 'darker' : 'light'}
          placement={disableStatus ? 'top' : 'bottom'}
          content={
            <>
              {disableStatus ? (
                <div tw="px-3 py-2">
                  该工作空间已被禁用，暂时无法操作其工作项
                </div>
              ) : (
                <Menu>
                  {subFuncList.map((subFunc) => (
                    <MenuItem key={subFunc.name}>
                      <Link
                        to={`/${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
                        tw="flex items-center space-x-1 py-2 px-5 (text-neut-15 no-underline)! hover:(bg-neut-1 text-current)"
                      >
                        <Icon name={subFunc.icon} />
                        <span>{subFunc.title}</span>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </>
          }
        >
          <Link
            to={`/${regionId}/workspace/${space.id}/${
              funcName === 'ops' ? 'ops/release' : ''
            }`}
            onClick={(e) => {
              if (disableStatus) {
                e.preventDefault()
              }
            }}
            tw="inline-block"
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
            <MenuItem value="update" disabled={disableStatus}>
              <Icon name="pen" />
              修改工作空间
            </MenuItem>
            <MenuItem value="disable" disabled={disableStatus}>
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
