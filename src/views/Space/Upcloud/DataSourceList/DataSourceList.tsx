import { useState } from 'react'
import { useToggle } from 'react-use'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useParams } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import dayjs from 'dayjs'
import { useImmer } from 'use-immer'
import {
  PageTab,
  Icon,
  Button,
  Loading,
  Table,
  Message,
  ToolBar,
  ToolBarLeft,
} from '@QCFE/qingcloud-portal-ui'
import { useQuerySource } from 'hooks'
import { Center, ContentBox, FlexBox, Icons, Menu, MenuItem } from 'components'
import DataSourceModal from './DataSourceModal'
import DataEmpty from './DataEmpty'

const tabs = [
  {
    title: '数据源',
    description:
      '数据源主要用于数据集成过程中 Reader 和 Writer 的对象，您可以在数据源管理页面查看、新增及批量新增数据源。指定的整个数据库全部或者部分表一次性的全部同步至MySQL，并且支持后续的实时增量同步模式，将新增数据持续同步至 MySQL。',
    icon: 'blockchain',
    helpLink: '/',
  },
]

const Root = styled('div')(() => [
  css`
    .page-tab-container {
      margin-bottom: 20px;
    }
  `,
])

const TableActions = styled(FlexBox)(() => [
  css`
    ${tw`items-center relative`}
    button.is-text {
      ${tw`text-link px-2 hover:text-link border-0`}
    }
  `,
])

const columns = [
  {
    title: '数据源名称/id',
    dataIndex: 'sourceid',
    render: (v: string, info: any) => (
      <FlexBox tw="space-x-1 items-center">
        <Center tw="w-6 h-6 bg-neut-3 rounded-full">
          <Icon name="blockchain" size="small" />
        </Center>
        <div tw="flex-1">
          <div>{info.name}</div>
          <div tw="text-neut-8">{v}</div>
        </div>
      </FlexBox>
    ),
  },
  {
    title: '状态',
    dataIndex: 'state',
    render: (v: string) => {
      if (v === 'enable') {
        return (
          <Center tw="space-x-1">
            <Icons name="circle_green" size={12} />
            <span>活跃中</span>
          </Center>
        )
      }
      return (
        <Center tw="space-x-1">
          <Icons name="circle_green" size={12} />
          <span>已停用</span>
        </Center>
      )
    },
  },
  {
    title: '数据源类型',
    dataIndex: 'sourcetype',
  },
  {
    title: '连通性测试状态',
    dataIndex: 'connected',
    render: (v: string) => {
      if (v === 'failed') {
        return <div>不通过</div>
      }
      return <div>通过</div>
    },
  },
  {
    title: '数据源描述',
    dataIndex: 'comment',
  },
  {
    title: '创建时间',
    dataIndex: 'updatetime',
    render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '操作',
    key: 'table_actions',
    render: (v: string, info: any) => (
      <TableActions>
        <Button type="text">表</Button>
        <div tw="border-l border-neut-3 h-5" />
        <Button type="text" disabled={info.state === 'enable'}>
          启动
        </Button>
        <Button type="text" disabled={info.state === 'disable'}>
          停用
        </Button>
        <Tippy
          // hideOnClick={false}
          theme="light"
          animation="fade"
          trigger="click"
          arrow
          interactive
          delay={100}
          offset={[0, 10]}
          appendTo={() => document.body}
          content={
            <Menu>
              <MenuItem>
                <Icon name="pen" tw="mr-2" />
                修改
              </MenuItem>
              <MenuItem disabled>
                <Icon name="trash" tw="mr-2" />
                删除
              </MenuItem>
            </Menu>
          }
        >
          <Center>
            <Icon name="more" clickable />
          </Center>
        </Tippy>
      </TableActions>
    ),
  },
]

const DataSourceList = observer(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [show, toggleShow] = useToggle(false)
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()

  const [filter] = useImmer<{
    regionId: string
    spaceId: string
    offset: number
    limit: number
    reverse: boolean
  }>({
    regionId,
    spaceId,
    reverse: true,
    offset: 0,
    limit: 10,
  })

  const { status, data } = useQuerySource(filter)

  if (status === 'loading') {
    return (
      <Root>
        <PageTab tabs={tabs} />
        <ContentBox tw="bg-white h-80">
          <Loading />
        </ContentBox>
      </Root>
    )
  }

  const sourceList = (data?.infos || []).map(({ connected, info }) => ({
    ...info,
    connected,
  }))

  return (
    <>
      {sourceList?.length ? (
        <Root>
          <PageTab tabs={tabs} />
          <ToolBar tw="bg-white">
            <ToolBarLeft>
              <Button type="primary" onClick={() => toggleShow(true)}>
                <Icon name="add" />
                新增数据源
              </Button>
              <Button
                type="default"
                disabled
                onClick={() => Message.info('删除')}
              >
                <Icon name="add" />
                删除
              </Button>
            </ToolBarLeft>
          </ToolBar>
          <Table
            selectType="checkbox"
            dataSource={sourceList}
            columns={columns}
            rowKey="sourceid"
            selectedRowKeys={selectedRowKeys}
            onSelect={(rowKeys: []) => setSelectedRowKeys(rowKeys)}
          />
        </Root>
      ) : (
        <DataEmpty onAddClick={() => toggleShow(true)} />
      )}
      {show && <DataSourceModal show={show} onHide={() => toggleShow(false)} />}
    </>
  )
})

export default DataSourceList
