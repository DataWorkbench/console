import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FlexBox, Icons, Tooltip, Center } from 'components'
import { Button, Checkbox, Menu } from '@QCFE/lego-ui'
import {
  Modal,
  Table,
  Icon,
  ToolBar,
  Divider,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import {
  getReleaseJobsKey,
  useMutationReleaseJobs,
  useQueryReleaseJobs,
  useStore,
} from 'hooks'
import tw, { css } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import dayjs from 'dayjs'
import { omitBy, get } from 'lodash-es'
import { useHistory, useParams } from 'react-router-dom'
import { AssoiateModal } from './AssoiateModal'
import ScheSettingModal from '../../../Dm/RealTime/ScheSettingModal'
import ReleaseModal from '../../../Dm/RealTime/ReleaseModal'

const { MenuItem } = Menu

const columnSettingsKey = 'OPS_RELEASE_COLUMN_SETTINGS'

interface ITypes {
  [key: number]: string
}

const JobTypes: ITypes = {
  1: 'StreamOperator',
  2: 'StreamSQL',
  3: 'StreamJAR',
  4: 'StreamPython',
  5: 'SreamScala',
}

export const ReleaseTable = observer(({ query }: any) => {
  const { workFlowStore } = useStore()

  const history = useHistory()
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()

  const [assoiateVisible, setAssoiateVisible] = useState(false)
  const [scheVisible, setScheVisible] = useState(false)
  const [releaseVisible, setReleaseVisible] = useState(false)
  const [currentRelease, setCurrentRelease] = useState<any>({})
  const [columnSettings, setColumnSettings] = useState(
    localstorage.getItem(columnSettingsKey) || []
  )

  const [filter, setFilter] = useImmer({
    limit: 10,
    offset: 0,
    reverse: true,
    search: '',
    status: undefined,
    job_id: '',
    sort_by: 'updated',
  })

  const toggle = useCallback(
    () => setAssoiateVisible(!assoiateVisible),
    [assoiateVisible]
  )

  const queryClient = useQueryClient()
  const mutation = useMutationReleaseJobs()

  const { isFetching, isRefetching, data } = useQueryReleaseJobs(
    omitBy(filter, (v) => v === '')
  )

  const infos = get(data, 'infos', []) || []

  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(getReleaseJobsKey())
  }, [queryClient])

  const handleMutation = useCallback(
    (row: any, op: OP, options?: any) => {
      mutation.mutate(
        {
          op,
          jobId: row.id,
          ...options,
        },
        {
          onSuccess: () => {
            refetchData()
          },
        }
      )
    },
    [mutation, refetchData]
  )

  const handleOperation = useCallback(
    (row: any) => {
      if (row.status === 1) {
        let stopRunning: boolean = false
        Modal.warning({
          title: `?????????????????? ${row.name}`,
          okType: 'danger',
          okText: '??????',
          content: (
            <>
              <div tw="text-neut-8 mb-2">
                ???????????????????????????????????????????????????????????????????
              </div>
              <Checkbox
                tw="text-white!"
                onChange={(_: any, checked: boolean) => {
                  stopRunning = checked
                }}
              >
                ??????????????????????????????
              </Checkbox>
            </>
          ),
          confirmLoading: mutation.isLoading,
          onOk: () => handleMutation(row, 'disable', { stopRunning }),
        })
      } else {
        Modal.info({
          title: `?????????????????? ${row.name}`,
          okText: '??????',
          content: <div tw="text-neut-8">???????????????????????? {row.name} ??????</div>,
          confirmLoading: mutation.isLoading,
          onOk: () => handleMutation(row, 'enable'),
        })
      }
    },
    [handleMutation, mutation.isLoading]
  )

  const hanldeMenuClick = useCallback(
    (key: OP, row: any) => {
      if (key === 'detail') {
        setCurrentRelease(row)
        toggle()
      } else if (key === 'view') {
        workFlowStore.set({ curViewJobId: row.id })
        history.push(`/${regionId}/workspace/${spaceId}/dm`)
      } else if (key === 'update') {
        workFlowStore.set({ curJob: row })
        setScheVisible(true)
      } else if (key === 'stop') {
        let stopRunning = false
        Modal.warning({
          confirmLoading: mutation.isLoading,
          title: `???????????? ${row.name}`,
          okType: 'danger',
          okText: '??????',
          content: (
            <>
              <div tw="text-neut-8 mb-2">
                ??????????????????????????????????????????????????????????????????????????????????????????????
              </div>
              <Checkbox
                tw="text-white!"
                onChange={(_: any, checked: boolean) => {
                  stopRunning = checked
                }}
              >
                ??????????????????????????????
              </Checkbox>
            </>
          ),
          onOk: () => {
            handleMutation(row, 'stop', { stopRunning })
          },
        })
      }
    },
    [
      handleMutation,
      history,
      mutation.isLoading,
      regionId,
      spaceId,
      toggle,
      workFlowStore,
    ]
  )

  const columns = useMemo(
    () => [
      {
        title: '????????????/ID',
        width: 200,
        dataIndex: 'name',
        render: (value: string, row: Record<string, any>) => {
          return (
            <FlexBox tw="items-center space-x-1">
              <Center
                tw="bg-neut-13 rounded-full w-7 h-7 mr-1.5 border-2 border-solid border-neut-16"
                className="release-icon"
              >
                <Icons name="stream-release" size={16} />
              </Center>
              <div tw="flex-1 break-all">
                <div>{row.name}</div>
                <div tw="text-neut-8">{row.id}</div>
              </div>
            </FlexBox>
          )
        },
      },
      {
        title: '????????????',
        dataIndex: 'status',
        render: (value: number) => {
          return (
            <div tw="flex items-center">
              <Icon
                tw="mr-2"
                name="radio"
                color={
                  [1, 4].includes(value)
                    ? {
                        primary: '#15A675',
                        secondary: '#C6F4E4',
                      }
                    : ''
                }
              />
              {/* eslint-disable-next-line no-nested-ternary */}
              {value === 1 ? '?????????' : value === 4 ? '?????????' : '?????????'}
            </div>
          )
        },
      },
      {
        title: '????????????',
        dataIndex: 'desc',
        // width: 250,
        render: (value: string) => (
          <Tooltip theme="light" content={<Center tw="p-3">{value}</Center>}>
            <div tw="max-w-[200px] truncate">{value}</div>
          </Tooltip>
        ),
      },
      {
        title: '????????????',
        width: 186,
        dataIndex: 'version',
      },
      {
        title: '????????????',
        dataIndex: 'type',
        render: (value: number) => <>{JobTypes[value]}</>,
      },
      {
        title: '??????????????????',
        dataIndex: 'created',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'created' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: number) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '??????????????????',
        dataIndex: 'updated',
        sortable: true,
        // filter.reverse ? 'asc' : 'desc',
        sortOrder:
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: number) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '??????',
        dataIndex: 'id',
        render: (_: String, row: any) => (
          <FlexBox tw="items-center">
            <Button
              type="text"
              disabled={row.status === 4}
              onClick={() => handleOperation(row)}
            >
              {row.status === 1 ? '??????' : '??????'}
            </Button>
            <Divider
              type="vertical"
              height={20}
              style={{ borderColor: '#475569', margin: '0 14px 0 5px' }}
            />
            <Center>
              <Tooltip
                arrow={false}
                trigger="click"
                placement="bottom-end"
                twChild={
                  css`
                    &[aria-expanded='true'] {
                      ${tw`bg-line-dark`}
                    }
                    svg {
                      ${tw`text-white! bg-transparent! fill-[transparent]!`}
                    }
                  ` as any
                }
                content={
                  <Menu
                    onClick={(e: any, key: OP) => hanldeMenuClick(key, row)}
                  >
                    <MenuItem key="detail">????????????</MenuItem>
                    <MenuItem key="view">????????????</MenuItem>
                    <MenuItem key="update">????????????</MenuItem>
                    <MenuItem key="stop">??????</MenuItem>
                  </Menu>
                }
              >
                <div tw="flex items-center p-0.5 cursor-pointer hover:bg-line-dark rounded-sm">
                  <Icon
                    name="more"
                    clickable
                    changeable
                    type="light"
                    size={20}
                  />
                </div>
              </Tooltip>
            </Center>
          </FlexBox>
        ),
      },
    ],
    [filter.reverse, filter.sort_by, handleOperation, hanldeMenuClick]
  )

  const filterColumn = columnSettings
    .map((o: { key: string; checked: boolean }) => {
      return o.checked && columns.find((col) => col.dataIndex === o.key)
    })
    .filter((o) => o)

  useEffect(() => {
    setFilter((draft) => {
      draft.search = query.search
      draft.status = query.status
      draft.job_id = query.job_id
      draft.offset = 0
    })
  }, [query, setFilter])

  return (
    <FlexBox orient="column">
      <FlexBox tw="justify-end pt-5 pb-3">
        <Button
          type="black"
          loading={isRefetching}
          tw="px-[5px] border-line-dark!"
        >
          <Icon
            name="if-refresh"
            tw="text-xl text-white"
            type="light"
            onClick={() => {
              refetchData()
            }}
          />
        </Button>
        <ToolBar tw="p-0 ml-2">
          <ToolBar.ColumnsSetting
            defaultColumns={columns}
            onSave={setColumnSettings}
            storageKey={columnSettingsKey}
          />
        </ToolBar>
      </FlexBox>
      <Table
        rowKey="id"
        loading={isFetching || mutation.isLoading}
        columns={filterColumn.length > 0 ? filterColumn : columns}
        dataSource={infos || []}
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
        onSort={(sortKey: any, order: string) => {
          setFilter((draft) => {
            draft.sort_by = sortKey
            draft.reverse = order === 'asc'
          })
        }}
      />

      <AssoiateModal
        type="modal"
        visible={assoiateVisible}
        toggle={() => {
          toggle()
        }}
        modalData={currentRelease}
      />

      {scheVisible && (
        <ScheSettingModal
          origin="ops"
          visible={scheVisible}
          onCancel={() => {
            setScheVisible(false)
          }}
          onSuccess={() => {
            setReleaseVisible(true)
          }}
        />
      )}

      {releaseVisible && (
        <ReleaseModal
          onSuccess={() => {
            setReleaseVisible(false)
            refetchData()
          }}
          onCancel={() => {
            setReleaseVisible(false)
          }}
        />
      )}
    </FlexBox>
  )
})

export default ReleaseTable
