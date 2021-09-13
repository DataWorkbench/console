import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import tw, { css } from 'twin.macro'
import { Tooltip, Radio, Dropdown, Menu, Icon } from '@QCFE/lego-ui'
import { useStore } from 'stores'
import { FlexBox } from 'components'
import { formatDate, getShortSpaceName } from 'utils/convert'
import Card from 'components/Card'
import { useWorkSpaceContext } from 'contexts'

interface IProps {
  regionId: string | number
  space: {
    id: string
    [propName: string]: any
  }
  className?: string
}

const SpaceItem: FC<IProps> = ({ regionId, space, className }) => {
  const stateStore = useWorkSpaceContext()
  const { isModal, curSpaceId, onSpaceSelected } = stateStore
  const {
    workSpaceStore: { funcList },
  } = useStore()

  const handleSelected = () => {
    if (isModal) {
      stateStore.set({ curSpace: space })
      onSpaceSelected({ curSpaceId: space.id, curRegionId: regionId })
    }
  }

  const handleSpaceOpt = (e, k, v) =>
    stateStore.set({ curSpaceOpt: v, optSpaces: [space] })

  const renderGrid = () => {
    if (isModal) {
      return (
        <FlexBox tw="justify-between items-center px-4 mb-3">
          <div>
            <span>我的角色：</span>
            <span tw="bg-neut-13 rounded-2xl text-white px-2 py-0.5 inline-block mr-1">
              {space.owner}
            </span>
            <span tw="bg-neut-2 text-neut-15 rounded-2xl px-2 py-0.5 inline-block">
              运维
            </span>
          </div>
          <div>
            <span>
              创建时间：
              <span tw="text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </FlexBox>
      )
    }
    return (
      <>
        <div tw="flex justify-between items-center px-4 mb-3">
          <div>
            <span>我的角色：</span>
            <span tw="bg-neut-13 rounded-2xl text-white px-2 py-0.5 inline-block mr-1">
              {space.owner}
            </span>
            <span tw="bg-neut-2 text-neut-15 rounded-2xl px-2 py-0.5 inline-block">
              运维
            </span>
          </div>
          <div tw="flex items-center ">
            <div>空间成员</div>
            <div tw="flex items-center">
              <div tw="w-6 h-6 bg-neut-3 rounded-full flex items-center justify-center mx-1">
                <Icon name="human" size={18} />
              </div>
              <div tw="w-6 h-6 bg-neut-3 rounded-full flex items-center justify-center mr-1">
                <Icon name="human" size={18} />
              </div>
              <div tw="w-6 h-6 bg-neut-3 rounded-full flex items-center justify-center">
                <Icon name="human" size={18} />
              </div>
            </div>
          </div>
        </div>
        <div tw="flex justify-between px-4 mb-3">
          <div tw="flex">
            <div tw="w-60 2xl:w-auto overflow-hidden break-all whitespace-nowrap overflow-ellipsis">
              开通引擎：共享Flink、QingMR、Deep Learning
            </div>
            <a href="##" tw="text-link">
              查看
            </a>
          </div>
          <div>
            <span>
              创建时间：
              <span tw="text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </div>
      </>
    )
  }
  return (
    <Card
      className={className}
      css={[
        tw`rounded border border-t-4 text-neut-8 border-neut-2`,
        isModal && tw`cursor-pointer`,
      ]}
      onClick={handleSelected}
    >
      <div tw="flex justify-between px-4 pt-5 mb-7 ">
        <div tw="flex-1 flex">
          <div
            className="profile"
            tw="w-11 h-11 flex justify-center items-center text-base font-medium rounded-sm"
          >
            {getShortSpaceName(space.name)}
          </div>
          <div tw="ml-3">
            <div tw="flex items-center">
              <span tw="font-medium text-base text-neut-16">{space.name}</span>
              <span>（{space.id}）</span>
              <span
                css={[
                  tw`py-0.5 px-3 rounded-2xl inline-flex items-center`,
                  space.status === 1 &&
                    tw`
                    text-green-11 bg-green-0
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
            <div tw="pt-1">{space.desc}</div>
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
                  <i className="if if-minus-square" tw="text-base mr-2" />
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
        <div tw="px-5 py-4 flex justify-center bg-neut-1 border-t border-neut-3">
          {funcList.map(({ name: funcName, title, subFuncList }, i) => (
            <Tooltip
              tw="p-0"
              key={funcName}
              content={subFuncList.map((subFunc) => (
                <Link
                  key={subFunc.name}
                  to={`${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
                  tw="flex items-center py-2 px-5 cursor-pointer hover:bg-neut-15 hover:text-white"
                >
                  <Icon name={subFunc.icon} type="light" tw="mr-1" />
                  {subFunc.title}
                </Link>
              ))}
              placement="bottomRight"
            >
              <Link
                to={`${regionId}/workspace/${space.id}/${funcName}`}
                tw="hover:text-green-11 h-full inline-block"
              >
                <button
                  type="button"
                  css={[
                    tw`font-semibold text-xs rounded-sm text-neut-13  bg-neut-1 border border-neut-3`,
                    tw`px-4 2xl:px-8 py-1`,
                    i < funcList.length - 1 ? tw`mr-4` : tw`mr-0`,
                    tw`focus:outline-none hover:bg-green-0 hover:border-green-11 hover:shadow transition-colors`,
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
  )
}

export default observer(SpaceItem)
