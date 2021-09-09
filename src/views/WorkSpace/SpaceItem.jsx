import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import tw, { css } from 'twin.macro'
import { useSpring, animated } from 'react-spring'
import { Tooltip, Radio, Dropdown, Menu, Icon } from '@QCFE/lego-ui'
import { useStore } from 'stores'
import { formatDate, getShortSpaceName } from 'utils/convert'
import Card from 'components/Card'
import { useWorkSpaceContext } from 'contexts'

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
        <div tw="tw-flex tw-justify-between tw-items-center tw-px-4 tw-mb-3">
          <div>
            <span>我的角色：</span>
            <span tw="tw-bg-neut-13 tw-rounded-2xl tw-text-white tw-px-2 tw-py-0.5 tw-inline-block tw-mr-1">
              {space.owner}
            </span>
            <span tw="tw-bg-neut-2 tw-text-neut-15 tw-rounded-2xl tw-px-2 tw-py-0.5 tw-inline-block">
              运维
            </span>
          </div>
          <div>
            <span>
              创建时间：
              <span tw="tw-text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </div>
      )
    }
    return (
      <>
        <div tw="tw-flex tw-justify-between tw-items-center tw-px-4 tw-mb-3">
          <div>
            <span>我的角色：</span>
            <span tw="tw-bg-neut-13 tw-rounded-2xl tw-text-white tw-px-2 tw-py-0.5 tw-inline-block tw-mr-1">
              {space.owner}
            </span>
            <span tw="tw-bg-neut-2 tw-text-neut-15 tw-rounded-2xl tw-px-2 tw-py-0.5 tw-inline-block">
              运维
            </span>
          </div>
          <div tw="tw-flex tw-items-center ">
            <div>空间成员</div>
            <div tw="tw-flex tw-items-center">
              <div tw="tw-w-6 tw-h-6 tw-bg-neut-3 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-1">
                <Icon name="human" size={18} />
              </div>
              <div tw="tw-w-6 tw-h-6 tw-bg-neut-3 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1">
                <Icon name="human" size={18} />
              </div>
              <div tw="tw-w-6 tw-h-6 tw-bg-neut-3 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <Icon name="human" size={18} />
              </div>
            </div>
          </div>
        </div>
        <div tw="tw-flex tw-justify-between tw-px-4 tw-mb-3">
          <div tw="tw-flex">
            <div tw="tw-w-60 2xl:tw-w-auto tw-overflow-hidden tw-break-all tw-whitespace-nowrap tw-overflow-ellipsis">
              开通引擎：共享Flink、QingMR、Deep Learning
            </div>
            <a href="##" tw="tw-text-link">
              查看
            </a>
          </div>
          <div>
            <span>
              创建时间：
              <span tw="tw-text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </div>
      </>
    )
  }
  return (
    <animated.div style={props} css={isModal && tw`tw-cursor-pointer`}>
      <Card
        className={className}
        tw="tw-rounded tw-border tw-border-t-4 tw-text-neut-8 tw-border-neut-2"
        onClick={handleSelected}
      >
        <div tw="tw-flex tw-justify-between tw-px-4 tw-pt-5 tw-mb-7 ">
          <div tw="tw-flex-1 tw-flex">
            <div
              className="profile"
              tw="tw-w-11 tw-h-11 tw-flex tw-justify-center tw-items-center tw-text-base tw-font-medium tw-rounded-sm"
            >
              {getShortSpaceName(space.name)}
            </div>
            <div tw="tw-ml-3">
              <div tw="tw-flex tw-items-center">
                <span tw="tw-font-medium tw-text-base tw-text-neut-16">
                  {space.name}
                </span>
                <span>（{space.id}）</span>
                <span
                  css={[
                    tw`tw-py-0.5 tw-px-3 tw-rounded-2xl tw-inline-flex tw-items-center`,
                    // space.status === 1 ? styles.st_active : styles.st_forbidden
                    space.status === 1 &&
                      tw`
                    tw-text-green-11 tw-bg-green-0
                    `,
                    space.status === 1 &&
                      css`
                        svg {
                          color: #00aa72;
                          fill: #dff7ed;
                        }
                      `,
                  ]}
                >
                  <Icon name="radio" />
                  {space.status === 1 ? '活跃' : '已禁用'}
                </span>
              </div>
              <div tw="tw-pt-1">{space.desc}</div>
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
                    <i
                      className="if if-minus-square"
                      tw="tw-text-base tw-mr-2"
                    />
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
          <div tw="tw-px-5 tw-py-4 tw-flex tw-justify-center tw-bg-neut-1 tw-border-t tw-border-neut-3">
            {funcList.map(({ name: funcName, title, subFuncList }, i) => (
              <Tooltip
                tw="tw-p-0"
                key={funcName}
                content={subFuncList.map((subFunc) => (
                  <Link
                    key={subFunc.name}
                    to={`${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
                    tw="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neut-15 hover:tw-text-white"
                  >
                    <Icon name={subFunc.icon} type="light" tw="tw-mr-1" />
                    {subFunc.title}
                  </Link>
                ))}
                placement="bottomRight"
              >
                <Link
                  to={`${regionId}/workspace/${space.id}/${funcName}`}
                  tw="hover:tw-text-green-11 tw-h-full tw-inline-block"
                >
                  <button
                    type="button"
                    css={[
                      tw`tw-font-semibold tw-text-xs tw-rounded-sm tw-text-neut-13  tw-bg-neut-1 tw-border tw-border-neut-3`,
                      tw`tw-px-4 2xl:tw-px-8 tw-py-1`,
                      i < funcList.length - 1 ? tw`tw-mr-4` : tw`tw-mr-0`,
                      tw`focus:tw-outline-none hover:tw-bg-green-0 hover:tw-border-green-11 hover:tw-shadow tw-transition-colors`,
                    ]}
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
