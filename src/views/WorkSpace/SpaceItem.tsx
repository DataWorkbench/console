import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import { Radio, Menu, Icon } from '@QCFE/lego-ui'
import { useStore } from 'stores'
import { FlexBox, Center, Box, Card, Tooltip } from 'components'
import { formatDate, getShortSpaceName } from 'utils/convert'
import { useWorkSpaceContext } from 'contexts'
import { OptButton } from './styled'

const { MenuItem } = Menu

const DarkTag = tw.span`bg-neut-13 rounded-2xl text-white px-2 py-0.5 inline-block`
const GrayTag = tw.span`bg-neut-2 text-neut-15 rounded-2xl px-2 py-0.5 inline-block`
const RoleIconWrapper = tw.div`w-6 h-6 bg-neut-3 rounded-full flex items-center justify-center mx-1`
const RowWrapper = tw(Center)`justify-between px-4 mb-3`
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
])

const Disp = tw.div`pt-0.5 h-7`

interface IProps {
  regionId: string
  space: {
    id: string
    [propName: string]: any
  }
  className?: string
}

const SpaceItem = observer(({ regionId, space, className }: IProps) => {
  const stateStore = useWorkSpaceContext()
  const { isModal, curSpaceId, onItemCheck } = stateStore
  const {
    workSpaceStore: { funcList },
  } = useStore()

  const handleSelected = () => {
    if (isModal) {
      stateStore.set({ curSpace: space })
      onItemCheck(regionId, space.id)
    }
  }

  const handleSpaceOpt = (e, k, v) => {
    stateStore.set({ curSpaceOpt: v, optSpaces: [space] })
  }

  const renderGrid = () => {
    if (isModal) {
      return (
        <RowWrapper>
          <Box tw="space-x-1">
            <span>我的角色：</span>
            <DarkTag>{space.owner}</DarkTag>
            <GrayTag>运维</GrayTag>
          </Box>
          <Box>
            创建时间：
            <span tw="text-neut-16">
              {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
            </span>
          </Box>
        </RowWrapper>
      )
    }
    return (
      <>
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
        </RowWrapper>
        <RowWrapper>
          <FlexBox>
            <div tw="w-60 2xl:w-auto overflow-hidden break-all whitespace-nowrap overflow-ellipsis">
              开通引擎：共享Flink、QingMR、Deep Learning
            </div>
            <a href="##" tw="text-link">
              查看
            </a>
          </FlexBox>
          <div>
            <span>
              创建时间：
              <span tw="text-neut-16">
                {formatDate(space.created, 'YYYY-MM-DD HH:mm:ss')}
              </span>
            </span>
          </div>
        </RowWrapper>
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
      <RowWrapper tw="pt-5 mb-7 items-start">
        <FlexBox tw="space-x-3">
          <Center
            size={44}
            className="profile"
            tw="text-base font-medium rounded-sm"
          >
            {getShortSpaceName(space.name)}
          </Center>
          <Box>
            <Center>
              <span tw="font-medium text-base text-neut-16">{space.name}</span>
              <span>（{space.id}）</span>
              <StateTag status={space.status}>
                <Icon name="radio" />
                {space.status === 1 ? '活跃' : '已禁用'}
              </StateTag>
            </Center>
            <Disp>{space.desc}</Disp>
          </Box>
        </FlexBox>
        {!isModal ? (
          <Tooltip
            placement="bottom-end"
            offset={[-6, -5]}
            theme="light"
            trigger="click"
            arrow={false}
            content={
              <Menu onClick={handleSpaceOpt}>
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
            <Icon name="more" clickable size={24} />
          </Tooltip>
        ) : (
          <Radio value={space.id} checked={space.id === curSpaceId} />
        )}
      </RowWrapper>
      {renderGrid()}
      {!isModal && (
        <div tw="px-5 py-4 flex justify-center bg-neut-1 border-t border-neut-3">
          {funcList.map(({ name: funcName, title, subFuncList }, i) => (
            <Tooltip
              theme="darker"
              key={funcName}
              disabled={space.status === 2}
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
              placement="bottom"
            >
              <Link
                to={`${regionId}/workspace/${space.id}/${funcName}`}
                css={space.status === 2 && tw`pointer-events-none`}
              >
                <OptButton
                  disabled={space.status === 2}
                  css={[
                    tw`px-4 2xl:px-8 py-1`,
                    i < funcList.length - 1 ? tw`mr-4` : tw`mr-0`,
                  ]}
                >
                  {title}
                </OptButton>
              </Link>
            </Tooltip>
          ))}
        </div>
      )}
    </Card>
  )
})

export default SpaceItem
