import React, { useState, useEffect } from 'react'
import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { MoreAction, FlexBox, Center, Modal, TextEllipsis, StatusBar } from 'components'

import { useQueryClient } from 'react-query'
import { observer } from 'mobx-react-lite'
import { get, omitBy } from 'lodash-es'
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
import { useParams } from 'react-router-dom'
import { formatDate } from 'utils'
import NewClusterModal from './ClusterModal'
import { ClusterColumns, ClusterFieldMapping, StatusEnum, resourceSpecState } from './constants'
import StopClusterModal from './StopClusterModal'

interface IRouteParams {
  regionId: string
  spaceId: string
}

interface ClusterTableProps {
  selectMode?: boolean
  selectedIds?: string[]
  onSelect?: (clusterId?: any[]) => void
}

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

const columnSettingsKey = 'DATA_SERVICE_DEV_CLUSTER_TABLE'

const ClusterTable = observer((props: ClusterTableProps) => {
  const { selectMode = false, selectedIds = [], onSelect } = props
  const queryClient = useQueryClient()
  const { spaceId } = useParams<IRouteParams>()

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
    { sort_by: getName('last_updated'), reverse: true, offset: 0, limit: 10 },
    { pagination: true, sort: true },
    columnSettingsKey
  )

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(selectedIds)

  const { isRefetching, isLoading, data } = useQueryListDataServiceClusters(
    {
      uri: { space_id: spaceId },
      params: omitBy(filter, (v) => v === '') as any
    },
    {
      refetchInterval: 60 * 1000
    }
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
    mutation.mutate(params, {
      onSuccess: () => {
        setDataServiceOp('')
        refetchData()
      }
    })
  }

  useEffect(() => {
    if (selectMode) {
      setSelectedRowKeys(selectedIds)
    }
  }, [selectMode, selectedIds])

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
    let result = [
      {
        text: '重启',
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
        disabled: [StatusEnum.RUNNING].includes(row.status),
        value: row,
        help: '如需修改，请先停用服务集群'
      },
      {
        text: '删除',
        icon: 'if-trash',
        disabled: [StatusEnum.RUNNING].includes(row.status),
        key: 'delete',
        value: row,
        help: '如需删除，请先停用服务集群'
      }
    ]

    if (row.status === StatusEnum.STOPPED) {
      result = result.filter((item) => ['start', 'update', 'delete'].includes(item.key))
    } else if (row.status === StatusEnum.RUNNING) {
      result = result.filter((item) => ['stop', 'update', 'delete'].includes(item.key))
    } else if (row.status === StatusEnum.EXCEPTION) {
      result = result.filter((item) => ['reload', 'delete'].includes(item.key))
    } else if (row.status === StatusEnum.STARTING) {
      result = result.filter((item) => [''].includes(item.key))
    } else if (row.status === StatusEnum.ARREARS) {
      result = result.filter((item) => ['reload', 'update', 'delete'].includes(item.key))
    } else if (row.status === StatusEnum.DELETED) {
      result = result.filter((item) => [''].includes(item.key))
    }
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
          type={StatusEnum.getEnum(StatusEnum.getLabel(v) as string)?.style}
          label={StatusEnum.getEnum(StatusEnum.getLabel(v) as string)?.label}
          isWrapper={false}
        />
      )
    },
    [getName('cu')]: {
      render: (v: any) => <div tw="flex items-center">{resourceSpecState.getLabel(v)}</div>
    },
    [getName('last_updated')]: {
      ...getSort(getName('last_updated')),
      render: (v: number, row: any) => <span tw="dark:text-neut-0">{formatDate(row.updated)}</span>
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
    !selectMode ? operation : undefined
  )

  const infos = get(data, 'infos', []) || []

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
                  draft.name = (e.target as HTMLInputElement).value
                  draft.offset = 0
                })
              }}
              onClear={() => {
                setFilter((draft) => {
                  if (draft.search) {
                    draft.offset = 0
                    draft.name = ''
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
        dataSource={infos}
        selectType={selectMode && 'radio'}
        selectedRowKeys={selectedRowKeys}
        onSelect={(keys: string[]) => {
          setSelectedRowKeys(keys)
          if (onSelect) {
            onSelect(infos.filter((info: any) => keys.includes(info.id)))
          }
        }}
        disabledRowKeys={
          selectMode
            ? infos.filter((info) => info.status !== StatusEnum.RUNNING).map((info) => info.id)
            : []
        }
        loading={isLoading}
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
        <StopClusterModal
          cluster={opClusterList as ClusterListInfo}
          onCancel={() => setDataServiceOp('')}
        />
      )}
    </FlexBox>
  )
})

export default ClusterTable
