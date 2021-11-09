import React, { useMemo, useState, useEffect, Fragment } from 'react'
import { useImmer } from 'use-immer'
import { Dropdown, Menu } from '@QCFE/lego-ui'
import { Button, Icon, InputSearch, Table } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center, Modal } from 'components'
import { useQueryClient } from 'react-query'
import { observer } from 'mobx-react-lite'
import {
  useStore,
  useQueryFlinkClusters,
  getFlinkClusterKey,
  useMutationCluster,
} from 'hooks'
import { get } from 'lodash-es'
import dayjs from 'dayjs'
import { css } from 'twin.macro'
import ClusterModal from './ClusterModal'

const { MenuItem } = Menu

const ClusterTable = observer(() => {
  const {
    dmStore: { setOp, op },
  } = useStore()
  const [opclusterList, setOpClusterList] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filter, setFilter] = useImmer({
    name: '',
    offset: 0,
    limit: 10,
    reverse: true,
    search: '',
    sort_by: '',
    status: '',
  })
  const queryClient = useQueryClient()
  const mutation = useMutationCluster()

  useEffect(() => {
    if (op === '') {
      setOpClusterList([])
    }
  }, [op])

  const columns = useMemo(() => {
    return [
      {
        title: '名称/ID',
        dataIndex: 'name',
        render: (v: any, row: any) => (
          <FlexBox tw="items-center space-x-1">
            <Center tw="bg-neut-13 rounded-full w-6 h-6">
              <Icon name="pod" type="light" />
            </Center>
            <div>
              <div>{row.name}</div>
              <div>{row.id}</div>
            </div>
          </FlexBox>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (v: number) => {
          const status = {
            1: {
              text: '运行中',
              color: {
                primary: '#15A675',
                secondary: '#C6F4E4',
              },
            },
            2: {
              text: '停止',
              color: {
                primary: '#939EA9',
                secondary: '#DEE7F1',
              },
            },
            3: {
              text: '启动中',
              color: {
                primary: '#2193D3',
                secondary: '#C1E9FF',
              },
            },
            4: {
              text: '异常',
              color: {
                primary: '#CF3B37',
                secondary: '#FEF2F2',
              },
            },
            5: {
              text: '欠费',
              color: {
                primary: '#A855F7',
                secondary: '#F6EDFF',
              },
            },
          }
          return (
            <FlexBox tw="items-center space-x-1">
              <Icon name="radio" color={get(status, [v, 'color'])} />
              <span>{get(status, [v, 'text'])}</span>
            </FlexBox>
          )
        },
      },
      {
        title: '版本',
        dataIndex: 'version',
      },
      {
        title: 'TaskManager',
        dataIndex: 'task_cu',
        render: (v) => `${v} CU`,
      },
      {
        title: 'JobManager',
        dataIndex: 'job_cu',
        render: (v) => `${v} CU`,
      },
      {
        title: '最近更新时间',
        dataIndex: 'updated',
        render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (v: any, row: any) => (
          <FlexBox tw="items-center">
            <Button type="text">Flink UI</Button>
            <Button
              type="text"
              onClick={() => {
                setOp('update')
                setOpClusterList([row])
              }}
            >
              修改
            </Button>
            <Center>
              <Dropdown
                content={
                  <Menu
                    onClick={(e: any, key: string) => {
                      setOp(key)
                      setOpClusterList([row])
                    }}
                  >
                    <MenuItem key="view">查看详情</MenuItem>
                    {(row.status === 1 || row.status === 3) && (
                      <MenuItem key="stop">停用</MenuItem>
                    )}
                    {row.status === 2 && <MenuItem key="start">启动</MenuItem>}
                    <MenuItem key="delete">删除</MenuItem>
                  </Menu>
                }
              >
                <Button type="text">
                  <Icon name="more" clickable type="light" />
                </Button>
              </Dropdown>
            </Center>
          </FlexBox>
        ),
      },
    ]
  }, [setOp, setOpClusterList])

  const refetchData = () => {
    queryClient.invalidateQueries(getFlinkClusterKey())
  }

  const mutateData = () => {
    mutation.mutate(
      {
        op,
        clusterIds: opclusterList.map((o) => o.id),
      },
      {
        onSuccess: () => {
          setOp('')
          refetchData()
        },
      }
    )
  }

  const { isFetching, isRefetching, data } = useQueryFlinkClusters(filter)
  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Button type="primary" onClick={() => setOp('create')}>
              <Icon name="add" />
              创建集群
            </Button>
            <Button disabled>
              <Icon name="trash" type="light" />
              <span>删除</span>
            </Button>
          </Center>
          <Center tw="space-x-3">
            <InputSearch
              tw="w-64"
              placeholder="请输入关键词进行搜索"
              onPressEnter={(e: React.SyntheticEvent) => {
                setFilter((draft) => {
                  draft.name = (e.target as HTMLInputElement).value
                })
              }}
              onClear={() => {
                setFilter((draft) => {
                  draft.name = ''
                })
              }}
            />
            <Button loading={isRefetching}>
              <Icon
                name="if-refresh"
                tw="text-xl text-white"
                type="light"
                onClick={() => {
                  refetchData()
                }}
              />
            </Button>
          </Center>
        </FlexBox>
      </div>
      <Table
        selectType="checkbox"
        dataSource={data?.infos || []}
        loading={isFetching}
        columns={columns}
        rowKey="id"
        pagination={{
          total: data?.total || 0,
          current: filter.offset / filter.limit + 1,
          pageSize: filter.limit,
          onPageChange: (current: number) => {
            setFilter((draft) => {
              draft.offset = (current - 1) * filter.limit
            })
          },
          onShowSizeChange: (size: number) => {
            setFilter((draft) => {
              draft.offset = 0
              draft.limit = size
            })
          },
        }}
        selectedRowKeys={selectedRowKeys}
        onSelect={(keys: string[]) => {
          setSelectedRowKeys(keys)
        }}
      />
      {(op === 'create' || op === 'update' || op === 'view') && (
        <ClusterModal opCluster={opclusterList[0]} />
      )}
      {(op === 'start' || op === 'stop' || op === 'delete') && (
        <Modal
          noBorder
          visible
          onCancel={() => setOp('')}
          onOk={mutateData}
          confirmLoading={mutation.isLoading}
        >
          <FlexBox tw="space-x-3">
            <Icon
              name="if-exclamation"
              css={css`
                color: #ffd127;
                font-size: 22px;
                line-height: 24px;
              `}
            />
            <section tw="flex-1">
              {(() => {
                const txtObj = { start: '启动', stop: '停用', delete: '删除' }
                const opText = txtObj[op]
                const clusterText = opclusterList.map((o) => (
                  <Fragment key={o.id}>
                    {o.name}
                    <span tw="text-neut-8">({o.id})</span>
                  </Fragment>
                ))
                return (
                  <>
                    <div tw="font-medium mb-2 text-base">
                      {opText}计算集群{clusterText}注意事项
                    </div>
                    <div className="modal-content-message">
                      {opText}计算集群{clusterText}
                      后，已发布的作业和正在运行中实例会受到影响
                      {op === 'stop'
                        ? `。确认${opText}吗？`
                        : ', 且该操作无法撤回。确认删除吗？'}
                    </div>
                  </>
                )
              })()}
            </section>
          </FlexBox>
        </Modal>
      )}
    </FlexBox>
  )
})

export default ClusterTable
