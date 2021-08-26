import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from 'stores'
import { Tooltip, Icon, Menu, Dropdown } from '@QCFE/lego-ui'
import { useWorkSpaceContext } from 'contexts'

function TableRowOpt({ space, regionId }) {
  const stateStore = useWorkSpaceContext()
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const handleClick = (e, key, value) => {
    stateStore.set({ curSpaceOpt: value, optSpaces: [space] })
  }
  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-space-x-1 2xl:tw-space-x-2">
      {funcList.map(({ name: funcName, title, subFuncList }) => (
        <Tooltip
          className="tw-p-0"
          key={funcName}
          content={subFuncList.map((subFunc) => (
            <Link
              key={subFunc.name}
              to={`${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
              className={clsx(
                'tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer  !tw-text-white',
                'hover:tw-bg-neut-15 hover:tw-no-underline'
              )}
            >
              <Icon name={subFunc.icon} type="light" />
              {subFunc.title}
            </Link>
          ))}
          placement="bottomRight"
        >
          <Link
            to={`${regionId}/workspace/${space.id}/${funcName}`}
            className="hover:tw-text-green-11"
          >
            <button
              type="button"
              className={clsx(
                'tw-font-semibold tw-text-xs tw-rounded-sm tw-text-neut-13  tw-bg-neut-1 tw-border tw-border-neut-3',
                'tw-px-2 2xl:tw-px-3 tw-py-1 ',
                'focus:tw-outline-none hover:tw-text-green-11 hover:tw-bg-green-0 hover:tw-border-green-11 hover:tw-shadow tw-transition-colors'
              )}
            >
              {title}
            </button>
          </Link>
        </Tooltip>
      ))}

      <Dropdown
        content={
          <Menu onClick={handleClick}>
            <Menu.MenuItem value="update">
              <Icon name="pen" />
              修改工作空间
            </Menu.MenuItem>
            <Menu.MenuItem value="disable" disabled={space.status === 2}>
              <i className="if if-minus-square tw-text-base tw-mr-2" />
              禁用工作空间
            </Menu.MenuItem>
            <Menu.MenuItem value="enable" disabled={space.status === 1}>
              <Icon name="start" />
              启动工作空间
            </Menu.MenuItem>
            <Menu.MenuItem value="delete">
              <Icon name="trash" />
              删除
            </Menu.MenuItem>
          </Menu>
        }
      >
        <Icon name="more" clickable changeable size={18} />
      </Dropdown>
    </div>
  )
}

TableRowOpt.propTypes = {
  space: PropTypes.object,
  regionId: PropTypes.string,
}

export default TableRowOpt
