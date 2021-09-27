import { useState, useMemo, Fragment } from 'react'
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
  Modal,
  ToolBarLeft,
} from '@QCFE/qingcloud-portal-ui'
import { useQuerySource, useMutationSource, useStore } from 'hooks'
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
      ${tw`text-link px-2 hover:text-link border-0 focus:text-link`}
    }
  `,
])

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-head {
      border-bottom: 0;
    }
    .modal-card-body {
      padding-top: 0;
    }
    .modal-card-foot {
      border-top: 0;
    }
  `,
])

const confirmOpts = ['disable', 'enable', 'delete']
const createUpdateOpts = ['create', 'update']

const DataSourceList = observer(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const {
    dataSourceStore: { op, opSourceList, mutateOperation },
  } = useStore()
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

  const columns = useMemo(
    () => [
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
                <Icons name="circle_enable" size={12} />
                <span>活跃中</span>
              </Center>
            )
          }
          return (
            <Center tw="space-x-1">
              <Icons name="circle_disable" size={12} />
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
            return (
              <Center tw="space-x-1">
                <Icons name="circle_close" size={12} />
                <span>不通过</span>
              </Center>
            )
          }
          return (
            <Center tw="space-x-1">
              <Icons name="circle_check" size={12} />
              <span>通过</span>
            </Center>
          )
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
            <Button
              type="text"
              disabled={info.state === 'disable'}
              onClick={() => {
                mutateOperation('disable', [info])
              }}
            >
              停用
            </Button>
            <Tippy
              theme="light"
              animation="fade"
              trigger="click"
              arrow={false}
              interactive
              delay={100}
              zIndex={9}
              offset={[0, 10]}
              appendTo={() => document.body}
              content={
                <Menu>
                  <MenuItem
                    onClick={() => {
                      mutateOperation('update', [info])
                    }}
                  >
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
    ],
    [mutateOperation]
  )

  const { status, data } = useQuerySource(filter)
  const mutation = useMutationSource()

  const handleOk = () => {
    if (op === '') {
      return
    }
    if (confirmOpts.includes(op)) {
      mutation.mutate(
        {
          op,
          regionId,
          spaceId,
          sourceIds: opSourceList.map((r) => r.sourceid),
        },
        {
          onSuccess: () => mutateOperation(),
        }
      )
    }
  }

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
              <Button type="primary" onClick={() => mutateOperation('create')}>
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
        <DataEmpty onAddClick={() => mutateOperation('create')} />
      )}
      {createUpdateOpts.includes(op) && (
        <DataSourceModal onHide={mutateOperation} />
      )}
      {confirmOpts.includes(op) && (
        <ModalWrapper
          visible
          okText="确认禁用"
          okType={op === 'enable' ? 'primary' : 'danger'}
          width={500}
          onOk={handleOk}
          confirmLoading={mutation.isLoading}
          onCancel={mutateOperation}
        >
          <div tw="flex items-start space-x-2">
            <Icon
              name={op === 'enable' ? 'if-exclamation' : 'if-information'}
              css={[
                tw`text-xl leading-6`,
                op !== 'enable' && { color: '#CF3B37' },
              ]}
            />
            <div>
              <FlexBox tw="font-semibold text-base text-neut-15">
                <span tw="mr-1">禁用数据源:</span>
                <div>
                  {opSourceList.map((r) => (
                    <Fragment key={r.name}>
                      <span tw="mr-1">{r.sourcetype}</span>
                      <span>{r.name}</span>
                      <span tw="text-neut-8">({r.sourceid})</span>
                    </Fragment>
                  ))}
                </div>
              </FlexBox>
              <div tw="text-neut-13 mt-2">
                已发布调度未运行的任务将不会再使用该数据源内的所有表数据，是否确认进行禁用操作？
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  )
})

export default DataSourceList
