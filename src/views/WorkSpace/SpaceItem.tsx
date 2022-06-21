import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import { Icon, Menu, Radio } from '@QCFE/lego-ui'
import { useStore } from 'stores'
import {
  Box,
  Card,
  Center,
  FlexBox,
  TextEllipsis,
  Tooltip,
  TextLink,
} from 'components'
import { formatDate, getShortSpaceName } from 'utils/convert'
import { useWorkSpaceContext } from 'contexts'

import { useMemberStore } from 'views/Space/Manage/Member/store'

import { OptButton, roleIcon, RoleNameWrapper } from './styled'

const { MenuItem, SubMenu } = Menu as any

const roleList = [
  {
    id: 1,
    name: '管理员',
    // icon: 'admin',
    icon: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    color: '#00aa72',
    email: 'ramones@yunify.com',
  },
  {
    id: 2,
    name: '普通用户',
    // icon: 'user',
    color: '#a16207',
    email: 'ramones@yunify.com',
  },
  {
    id: 3,
    name: '访客',
    // icon: 'guest',
    color: '#a48a19',
    email: 'ramones@yunify.com',
  },
  {
    id: 4,
    name: '禁用',
    // icon: 'disable',
    color: '#a48a19',
    email: 'ramones@yunify.com',
  },
]

const RoleIcons = ({ list }: { list: Record<string, any>[] }) => {
  const [hoverIndex, setHoverIndex] = useState(0)

  return (
    <div tw="flex" onMouseLeave={() => setHoverIndex(0)}>
      {list.slice(0, 3).map((item, idx) => {
        return (
          <div
            key={item.id}
            css={roleIcon.item({
              zIndex: list.length - Math.abs(hoverIndex - idx),
              index: idx,
            })}
            onMouseMove={() => setHoverIndex(idx)}
          >
            <Tooltip
              content={item.email}
              hasPadding
              theme="darker"
              twChild={tw`flex`}
            >
              <Center tw="h-6 w-6">
                {item.icon ? (
                  <img src={item.icon} alt="" width={24} />
                ) : (
                  <Icon name="human" size={14} />
                )}
              </Center>
            </Tooltip>
          </div>
        )
      })}
      {list.length > 3 && (
        <div
          key="others"
          css={roleIcon.item({
            zIndex: list.length - Math.abs(hoverIndex - 3),
            index: 3,
          })}
          onMouseMove={() => setHoverIndex(3)}
        >
          {`+${list.length - 3}`}
        </div>
      )}
    </div>
  )
}
// const DarkTag = tw.span`bg-neut-13 rounded-2xl text-white px-2 py-0.5 inline-block`
// const GrayTag = tw.span`bg-neut-2 text-neut-15 rounded-2xl px-2 py-0.5 inline-block`
// const RoleIconWrapper = tw.div`w-6 h-6 bg-neut-3 rounded-full flex items-center justify-center mx-1`
// const RowWrapper = tw(Center)`justify-between px-4 mb-3`
const StateTag = styled('span')(({ status }: { status: number }) => [
  tw`py-0.5 px-3 rounded-2xl inline-flex items-center`,
  status === 1
    ? tw`text-green-11 bg-green-0`
    : css`
        color: #a16207;
        background: #fffded;

        svg {
          color: #a48a19;
          fill: rgba(255, 209, 39, 0.2);
        }
      `,
  status === 1 &&
    css`
      svg {
        color: #00aa72;
        fill: #dff7ed;
      }
    `,
  status !== 1 && tw`w-24`,
])

// const Disp = tw.div`pt-0.5 pr-6 h-7 truncate`

interface IProps {
  regionId: string
  space: {
    id: string
    [propName: string]: any
  }
  className?: string
}

const isNetworkInit = (
  platform: Record<string, any>,
  space: Record<string, any>
) => {
  return (
    platform &&
    platform.work_in_iaas &&
    platform.enable_network &&
    space.status !== 2 &&
    !space.network_is_init
  )
}

const SpaceItem = observer(({ regionId, space, className }: IProps) => {
  const stateStore = useWorkSpaceContext()
  const { isModal, curSpaceId, onItemCheck, platformConfig } = stateStore
  const history = useHistory()
  const {
    workSpaceStore: { funcList },
  } = useStore()

  const memberStore = useMemberStore()

  const handleCardClick = () => {
    if (space.status !== 1) {
      return
    }
    if (isModal) {
      stateStore.set({ curSpace: space })
      onItemCheck(regionId, space.id)
    } else {
      history.push(`/${regionId}/workspace/${space.id}/upcloud`)
    }
  }

  const handleSpaceOpt = (e: MouseEvent, _: never, v: any) => {
    e.stopPropagation()
    stateStore.set({ curSpaceOpt: v, optSpaces: [space] })
  }

  const renderGrid = () => {
    if (isModal) {
      return (
        <FlexBox>
          {/* <Box tw="space-x-1">
            <span>我的角色：</span>
            <DarkTag>{space.owner}</DarkTag>
            <GrayTag>运维</GrayTag>
          </Box> */}
          <Box>
            创建时间：
            <span tw="text-neut-16">
              {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
            </span>
          </Box>
        </FlexBox>
      )
    }
    return (
      <>
        {/*
        <RowWrapper>
          <Box tw="space-x-1">
            <span>我的角色：</span>
            <DarkTag>{space.owner}</DarkTag>
            <GrayTag>运维</GrayTag>
          </Box>
          <FlexBox>
            <span>空间成员</span>
            <RoleIconWrapper>
              <Icon name="human" size={18} />
            </RoleIconWrapper>
            <RoleIconWrapper>
              <Icon name="human" size={18} />
            </RoleIconWrapper>
            <RoleIconWrapper>
              <Icon name="human" size={18} />
            </RoleIconWrapper>
          </FlexBox>
        </RowWrapper> */}
        <FlexBox>
          {/* <FlexBox>
            <div tw="w-60 2xl:w-auto overflow-hidden break-all whitespace-nowrap overflow-ellipsis">
              开通引擎：共享Flink、QingMR、Deep Learning
            </div>
            <a href="##" tw="text-link">
              查看
            </a>
          </FlexBox> */}
          <div>
            <span>
              创建时间：
              <span tw="text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </FlexBox>

        <FlexBox
          tw="justify-between mt-3 cursor-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div tw="inline">我的角色：</div>
            <RoleNameWrapper>空间所有者</RoleNameWrapper>
          </div>
          <div tw="flex items-center w-[180px] justify-end">
            <div tw="inline">空间成员：</div>
            {/* <RoleNameWrapper>空间所有者</RoleNameWrapper> */}
            {space.roles ? (
              <RoleIcons list={space.roles ?? roleList} />
            ) : (
              <FlexBox tw="gap-1">
                <span>无成员</span>
                <TextLink
                  hasIcon={false}
                  onClick={(e) => {
                    e.stopPropagation()
                    memberStore.set({
                      op: 'create',
                      spaceItem: {
                        id: space.id,
                        name: space.name,
                        regionId,
                      },
                    })
                  }}
                >
                  添加
                </TextLink>
              </FlexBox>
            )}
          </div>
        </FlexBox>
      </>
    )
  }
  const disableStatus = space.status === 2

  return (
    <Card
      className={`${className} group`}
      tw="rounded border border-t-4 text-neut-8 border-neut-2 relative"
      css={css`
        box-shadow: 0px 5px 15px rgba(3, 5, 7, 0.08);
      `}
      onClick={handleCardClick}
    >
      {isNetworkInit(stateStore.platformConfig, space) && (
        <div
          tw="absolute inset-0 z-50"
          title="请单击以绑定网络信息"
          onClick={(e) => {
            handleSpaceOpt(
              e as unknown as MouseEvent,
              undefined as never,
              'network'
            )
          }}
        />
      )}
      <div
        tw="px-5 pt-4 pb-5 relative cursor-pointer"
        css={space.status !== 1 && tw`cursor-default`}
      >
        {isModal && (
          <Radio
            tw="absolute top-2 right-3"
            value={space.id}
            checked={space.id === curSpaceId}
          />
        )}
        <FlexBox tw="mb-7 items-center">
          <FlexBox tw="space-x-3 w-full items-center">
            <Center
              size={44}
              className="profile"
              tw="text-base font-medium rounded-sm min-w-[44px]"
            >
              {getShortSpaceName(space.name)}
            </Center>
            <Box tw="flex-1 overflow-hidden min-w-[276px]">
              <FlexBox tw="items-center">
                <span
                  className="wks-title"
                  tw="font-medium text-base text-neut-16 truncate max-w-[80px] transition-colors group-hover:text-green-11"
                  title={space.name}
                >
                  {space.name}
                </span>
                <span tw="truncate max-w-[130px]">（{space.id}）</span>
                <StateTag status={space.status}>
                  <Icon name="radio" />
                  {space.status === 1 ? '活跃' : '已禁用'}
                </StateTag>
              </FlexBox>
              <div tw="pt-0.5 h-7 truncate" title={space.desc || ''}>
                <TextEllipsis twStyle={tw`text-neut-8`}>
                  {space.desc || '暂无描述'}
                </TextEllipsis>
              </div>
            </Box>
            {!isModal && (
              <div
                tw="self-baseline"
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation()
                }}
              >
                <Tooltip
                  twChild={tw`self-start`}
                  placement="bottom-end"
                  offset={[0, -5]}
                  theme="light"
                  trigger="click"
                  arrow={false}
                  zIndex={119} // 阻止冒泡后tooltip不会消失 modal z-index
                  content={
                    <Menu onClick={handleSpaceOpt}>
                      <MenuItem value="update" disabled={disableStatus}>
                        <Icon name="pen" />
                        修改工作空间
                      </MenuItem>
                      {!disableStatus && (
                        <MenuItem value="disable" disabled={disableStatus}>
                          <i
                            className="if if-minus-square"
                            tw="text-base mr-2"
                          />
                          禁用工作空间
                        </MenuItem>
                      )}
                      {space.status !== 1 && (
                        <MenuItem value="enable" disabled={space.status === 1}>
                          <Icon name="start" />
                          启动工作空间
                        </MenuItem>
                      )}
                      <MenuItem value="delete">
                        <Icon name="trash" />
                        删除
                      </MenuItem>
                    </Menu>
                  }
                >
                  <Icon name="more" clickable size={24} />
                </Tooltip>
              </div>
            )}
          </FlexBox>
        </FlexBox>

        {renderGrid()}
      </div>
      {!isModal && (
        <div
          tw="px-5 py-4 flex justify-center bg-neut-1 border-t border-neut-3 space-x-4 xl:space-x-4 2xl:space-x-4"
          onClick={(e: React.SyntheticEvent) => {
            e.stopPropagation()
          }}
        >
          {funcList.map(({ name: funcName, title, subFuncList }) => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const disableStatus = space.status === 2 || subFuncList.length === 0
            const disableMsg =
              // eslint-disable-next-line no-nested-ternary
              space.status === 2
                ? '该工作空间已被禁用，暂时无法操作其工作项'
                : !platformConfig?.work_in_iaas
                ? '敬请期待'
                : ''

            return (
              <Tooltip
                key={funcName}
                theme={disableStatus ? 'darker' : 'light'}
                placement={disableStatus ? 'top' : 'bottom'}
                content={
                  <>
                    {disableStatus ? (
                      <div tw="px-3 py-2">{disableMsg}</div>
                    ) : (
                      <Menu
                        mode="inline"
                        defaultExpandKeys={['stream']}
                        onClick={(e: React.SyntheticEvent) => {
                          e.stopPropagation()
                        }}
                      >
                        {subFuncList.map((subFunc: any) => {
                          const subItems = subFunc.items || []
                          return subItems.length ? (
                            <SubMenu
                              key={subFunc.name}
                              onClick={(e: React.SyntheticEvent) => {
                                e.stopPropagation()
                              }}
                              title={
                                <span>
                                  <Icon name={subFunc.icon} />
                                  <span>{subFunc.title}</span>
                                </span>
                              }
                              overlayClassName="sub"
                            >
                              {subItems.map((secondMenu: any) => (
                                <MenuItem key={secondMenu.name}>
                                  <Link
                                    to={`/${regionId}/workspace/${space.id}/${funcName}/${secondMenu.name}`}
                                    tw="flex items-center py-2 pl-6! cursor-pointer text-neut-15 hover:bg-neut-1 hover:text-current"
                                  >
                                    {secondMenu.title}
                                  </Link>
                                </MenuItem>
                              ))}
                            </SubMenu>
                          ) : (
                            <MenuItem key={subFunc.name}>
                              <Link
                                to={`/${regionId}/workspace/${space.id}/${funcName}/${subFunc.name}`}
                                tw="flex items-center py-2 px-5 cursor-pointer text-neut-15 hover:bg-neut-1 hover:text-current"
                              >
                                <Icon
                                  name={subFunc.icon}
                                  type="dark"
                                  tw="mr-1"
                                />
                                {subFunc.title}
                              </Link>
                            </MenuItem>
                          )
                        })}
                      </Menu>
                    )}
                  </>
                }
              >
                <Link
                  to={`/${regionId}/workspace/${space.id}/${
                    funcName === 'ops' ? 'ops/release' : funcName
                  }`}
                  onClick={(e) => {
                    if (disableStatus) {
                      e.preventDefault()
                    }
                  }}
                  tw="inline-block"
                >
                  <OptButton disabled={disableStatus} tw="py-1">
                    {title}
                  </OptButton>
                </Link>
              </Tooltip>
            )
          })}
        </div>
      )}
    </Card>
  )
})

export default SpaceItem
