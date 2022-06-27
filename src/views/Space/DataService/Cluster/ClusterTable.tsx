import React, { useState, useEffect } from 'react'
import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { MoreAction, FlexBox, Center, Modal, TextEllipsis, StatusBar } from 'components'

import { useQueryClient } from 'react-query'
import { observer } from 'mobx-react-lite'
import { get, omitBy } from 'lodash-es'
import dayjs from 'dayjs'
import tw, { css } from 'twin.macro'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'

import { useStore, useMutationDataServiceCluster } from 'hooks'
import useFilter from 'hooks/useHooks/useFilter'

import {
  useQueryListDataServiceClusters,
  ClusterListInfo,
  getQueryKeyListDataServiceClusters
} from 'hooks/useDataService'
import NewClusterModal from './ClusterModal'
import { ClusterColumns, StatusMap, getStatusNumber, ClusterFieldMapping } from './constants'

import StopClusterModal from './StopClusterModal'

const { ColumnsSetting } = ToolBar as any

const getName = (name: MappingKey<typeof ClusterFieldMapping>) =>
  ClusterFieldMapping.get(name)!.apiField

const getOptionText = (option: OP, id: string | undefined) => {
  let text = '删除'
  let desc = ''
  switch (option) {
    case 'start':
      text = '启动'
      desc = `确认启用服务集群名称（ID: ${id}）`
      break
    case 'stop':
      text = '停用'
      desc = `确认停用服务集群名称（ID: ${id}）`
      break
    case 'reload':
      text = '重启'
      desc = `重启过程中相关 API 不可访问，确认重启服务集群名称（ID :${id}）`
      break
    default:
      text = '删除'
      desc = `删除后无法恢复，确认删除服务集群名称（ID :${id}）`
      break
  }
  return { text, desc }
}

const columnSettingsKey = 'DATA_SERVICE_CLUSTER_TABLE'

const ClusterTable = observer(() => {
  const queryClient = useQueryClient()

  const {
    dtsStore: { setDataServiceOp, dataServiceOp }
  } = useStore()
  const [opClusterList, setOpCluster] = useState<ClusterListInfo | null>()
  const {
    filter,
    setFilter,
    pagination,
    sort,
    getColumnSort: getSort
  } = useFilter<
    Record<ReturnType<typeof getName>, number | string | boolean>,
    { pagination: true; sort: true }
  >(
    { sort_by: getName('last_updated'), reverse: true },
    { pagination: true, sort: true },
    columnSettingsKey
  )

  const { isRefetching, data } = useQueryListDataServiceClusters(
    omitBy(filter, (v) => v === '') as any
  )

  const mutation = useMutationDataServiceCluster()

  useEffect(() => {
    if (dataServiceOp === '') {
      setOpCluster(null)
    }
  }, [dataServiceOp])

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListDataServiceClusters())
  }

  const mutateData = () => {
    const params = {
      op: dataServiceOp,
      clusterId: opClusterList?.id
    }
    if (dataServiceOp === 'delete') {
      // TODO: 查服务集群对应的已发布api， 并弹出弹框
    }
    mutation.mutate(params, {
      onSuccess: () => {
        setDataServiceOp('')
        refetchData()
      }
    })
  }

  const handleMenuClick = (record: ClusterListInfo, key: string) => {
    if (key === 'update') {
      setOpCluster(record)
      setDataServiceOp('update')
    } else {
      setOpCluster(record)
      setDataServiceOp(key as OP)
    }
  }

  const getActions = (row: ClusterListInfo) => {
    const result = [
      {
        text: '恢复',
        icon: 'restart',
        key: 'reload',
        value: row
      },
      {
        text: '启动',
        icon: 'start',
        key: 'start',
        value: row
      },
      {
        text: '停用',
        icon: 'stop',
        key: 'stop',
        value: row
      },
      {
        text: '修改',
        icon: 'edit',
        key: 'update',
        value: row,
        help: '如需修改，请先停用服务集群'
      },
      {
        text: '删除',
        icon: 'if-trash',
        disabled: row.status === 1,
        key: 'delete',
        value: row,
        help: '如需删除，请先停用服务集群'
      }
    ]
    return result
  }

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <FlexBox tw="items-center space-x-1 truncate">
          <Center
            className="clusterIcon"
            tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
          >
            <Icon name="q-dockerHubDuotone" type="light" />
          </Center>
          <div tw="truncate">
            <TextEllipsis twStyle={tw`font-semibold`}>{row.name}</TextEllipsis>
            <div tw="dark:text-neut-8">{row.id}</div>
          </div>
        </FlexBox>
      )
    },
    [getName('status')]: {
      render: (v: number) => (
        <StatusBar
          type={StatusMap.get(getStatusNumber.get(v))?.style}
          label={StatusMap.get(getStatusNumber.get(v))?.label}
          isWrapper={false}
        />
      )
    },
    [getName('last_updated')]: {
      ...getSort(getName('last_updated')),
      render: (v: number, row: any) => (
        <span tw="dark:text-neut-0">{dayjs(row.last_updated).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    }
  }

  const operation = {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (_: never, record: any) => (
      <MoreAction theme="darker" items={getActions(record)} onMenuClick={handleMenuClick} />
    )
  }

  const { columns, setColumnSettings } = useColumns(
    columnSettingsKey,
    ClusterColumns,
    columnsRender,
    operation
  )

  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Button type="primary" onClick={() => setDataServiceOp('create')}>
              <Icon name="add" />
              创建
            </Button>
          </Center>
          <Center tw="space-x-3">
            <InputSearch
              tw="w-64 border-2 rounded-sm  dark:border-neut-15"
              placeholder="请输入关键词进行搜索"
              onPressEnter={(e: React.SyntheticEvent) => {
                setFilter((draft) => {
                  draft.search = (e.target as HTMLInputElement).value
                  draft.offset = 0
                })
              }}
              onClear={() => {
                setFilter((draft) => {
                  if (draft.search) {
                    draft.offset = 0
                    draft.search = ''
                  }
                })
              }}
            />
            <Button type="black" loading={isRefetching} tw="px-[5px] border-line-dark!">
              <Icon
                name="if-refresh"
                tw="text-xl text-white"
                type="light"
                onClick={() => {
                  refetchData()
                }}
              />
            </Button>
            <ColumnsSetting
              defaultColumns={ClusterColumns}
              onSave={setColumnSettings}
              storageKey={columnSettingsKey}
            />
          </Center>
        </FlexBox>
      </div>

      <Table
        dataSource={get(data, 'infos', [])}
        loading={false}
        columns={columns}
        rowKey="id"
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
        onSort={sort}
      />
      {(dataServiceOp === 'create' || dataServiceOp === 'update') && (
        <NewClusterModal opWork={opClusterList as any} />
      )}
      {(dataServiceOp === 'start' || dataServiceOp === 'delete' || dataServiceOp === 'reload') && (
        <Modal
          noBorder
          visible
          width={400}
          onCancel={() => setDataServiceOp('')}
          onOk={mutateData}
          footer={
            <FlexBox tw="justify-end">
              <Button onClick={() => setDataServiceOp('')}>取消</Button>
              <Button
                type={dataServiceOp === 'start' ? 'primary' : 'danger'}
                loading={mutation.isLoading}
                onClick={mutateData}
              >
                {getOptionText(dataServiceOp, opClusterList?.id).text}
              </Button>
            </FlexBox>
          }
        >
          <FlexBox tw="space-x-3 mb-3">
            <Icon
              name="if-exclamation"
              css={css`
                color: #ffd127;
                font-size: 22px;
                line-height: 24px;
              `}
            />

            <section tw="flex-1">
              {(() => (
                <>
                  <div tw="font-medium mb-2 text-base">{`${
                    getOptionText(dataServiceOp, opClusterList?.id).text
                  }服务集群${opClusterList?.id}(ID)`}</div>
                  <div className="modal-content-message" tw="text-neut-9">
                    {getOptionText(dataServiceOp, opClusterList?.id).desc}
                  </div>
                </>
              ))()}
            </section>
          </FlexBox>
        </Modal>
      )}
      {dataServiceOp === 'stop' && (
        <StopClusterModal selectKey={opClusterList} onCancel={() => setDataServiceOp('')} />
      )}
    </FlexBox>
  )
})

export default ClusterTable
