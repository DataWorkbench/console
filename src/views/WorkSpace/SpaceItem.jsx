import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSpring, animated } from 'react-spring'
import { Tooltip, Radio, Dropdown, Menu, Icon } from '@QCFE/lego-ui'
import { useStore } from 'stores'
import { formatDate } from 'utils/convert'
import Card from 'components/Card'
import { useWorkSpaceContext } from 'contexts'
import styles from './styles.module.css'

function getProfileName(str) {
  const pattern = new RegExp('[\u4E00-\u9FA5]+')
  const profileName = str.substr(0, 2)
  if (pattern.test(profileName)) {
    return str.substr(0, 1)
  }
  return profileName
}

function SpaceItem({ regionId, space, className }) {
  const stateStore = useWorkSpaceContext()
  const { isModal, curSpaceId, onSpaceSelected } = stateStore
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const [props, api] = useSpring(() => ({
    from: { scale: 1.03, opacity: 0.2 },
    to: { scale: 1, opacity: 1 },
    config: { duration: 250 },
  }))

  const handleSelected = () => {
    if (isModal) {
      stateStore.set({ curSpace: space })
      onSpaceSelected({ curSpaceId: space.id, curRegionId: regionId })
      api.start({ reset: true })
    }
  }

  const handleSpaceOpt = (e, k, v) =>
    stateStore.set({ curSpaceOpt: v, optSpaces: [space] })

  const renderGrid = () => {
    if (isModal) {
      return (
        <div className="tw-flex tw-justify-between tw-items-center tw-px-4 tw-mb-3">
          <div>
            <span>我的角色：</span>
            <span className="tw-bg-neut-13 tw-rounded-2xl tw-text-white tw-px-2 tw-py-0.5 tw-inline-block tw-mr-1">
              {space.owner}
            </span>
            <span className="tw-bg-neut-2 tw-text-neut-15 tw-rounded-2xl tw-px-2 tw-py-0.5 tw-inline-block">
              运维
            </span>
          </div>
          <div>
            <span>
              创建时间：
              <span className="tw-text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </div>
      )
    }
    return (
      <>
        <div className="tw-flex tw-justify-between tw-items-center tw-px-4 tw-mb-3">
          <div>
            <span>我的角色：</span>
            <span className="tw-bg-neut-13 tw-rounded-2xl tw-text-white tw-px-2 tw-py-0.5 tw-inline-block tw-mr-1">
              {space.owner}
            </span>
            <span className="tw-bg-neut-2 tw-text-neut-15 tw-rounded-2xl tw-px-2 tw-py-0.5 tw-inline-block">
              运维
            </span>
          </div>
          <div className="tw-flex tw-items-center ">
            <div>空间成员</div>
            <div className="tw-flex tw-items-center">
              <div className="tw-w-6 tw-h-6 tw-bg-neut-3 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-1">
                <Icon name="human" size={18} />
              </div>
              <div className="tw-w-6 tw-h-6 tw-bg-neut-3 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1">
                <Icon name="human" size={18} />
              </div>
              <div className="tw-w-6 tw-h-6 tw-bg-neut-3 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <Icon name="human" size={18} />
              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-justify-between tw-px-4 tw-mb-3">
          <div className="tw-flex">
            <div className="tw-w-60 2xl:tw-w-auto tw-overflow-hidden tw-break-all tw-whitespace-nowrap tw-overflow-ellipsis">
              开通引擎：共享Flink、QingMR、Deep Learning
            </div>
            <a href="##" className="tw-text-link">
              查看
            </a>
          </div>
          <div>
            <span>
              创建时间：
              <span className="tw-text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </div>
      </>
    )
  }

  return (
    <animated.div
      style={props}
      className={clsx(isModal && 'tw-cursor-pointer')}
    >
      <Card
        className={clsx(
          'tw-rounded tw-border tw-border-t-4 tw-text-neut-8 tw-border-neut-2',
          className
        )}
        onClick={handleSelected}
      >
        <div className="tw-flex tw-justify-between tw-px-4 tw-pt-5 tw-mb-7 ">
          <div className="tw-flex-1 tw-flex">
            <div
              className={clsx(
                'tw-w-11 tw-h-11 tw-flex tw-justify-center tw-items-center tw-text-base tw-font-medium tw-rounded-sm',
                styles.profile
              )}
            >
              {getProfileName(space.name)}
            </div>
            <div className="tw-ml-3">
              <div className="tw-flex tw-items-center">
                <span className="tw-font-medium tw-text-base tw-text-neut-16">
                  {space.name}
                </span>
                <span>（{space.id}）</span>
                <span
                  className={clsx(
                    'tw-py-0.5 tw-px-3 tw-rounded-2xl tw-inline-flex tw-items-center',
                    space.status === 1 ? styles.st_active : styles.st_forbidden
                  )}
                >
                  <Icon name="radio" />
                  {space.status === 1 ? '活跃' : '已禁用'}
                </span>
              </div>
              <div className="tw-pt-1">{space.desc}</div>
            </div>
          </div>
          {!isModal ? (
            <Dropdown
              content={
                <Menu onClick={handleSpaceOpt}>
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
              <Icon name="more" clickable size={24} />
            </Dropdown>
          ) : (
            <Radio value={space.id} checked={space.id === curSpaceId} />
          )}
        </div>
        {renderGrid()}
        {!isModal && (
          <div className="tw-px-5 tw-py-4 tw-flex tw-justify-center tw-bg-neut-1 tw-border-t tw-border-neut-3">
            {funcList.map(({ name: funcName, title, subFuncList }, i) => (
              <Tooltip
                className="tw-p-0"
                key={funcName}
                content={subFuncList.map((subFunc) => (
                  <Link
                    key={subFunc.name}
                    to={`${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
                    className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neut-15 hover:tw-text-white"
                  >
                    <Icon
                      name={subFunc.icon}
                      type="light"
                      className="tw-mr-1"
                    />
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
                      'tw-px-4 2xl:tw-px-8 tw-py-1',
                      i < funcList.length - 1 ? 'tw-mr-4' : 'tw-mr-0',
                      'focus:tw-outline-none hover:tw-bg-green-0 hover:tw-border-green-11 hover:tw-shadow tw-transition-colors'
                    )}
                  >
                    {title}
                  </button>
                </Link>
              </Tooltip>
            ))}
          </div>
        )}
      </Card>
    </animated.div>
  )
}
SpaceItem.propTypes = {
  regionId: PropTypes.string,
  space: PropTypes.object,
  className: PropTypes.string,
}

export default observer(SpaceItem)
