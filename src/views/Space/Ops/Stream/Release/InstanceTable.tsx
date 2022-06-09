import { useCallback, useState } from 'react'
import { Button, Menu } from '@QCFE/lego-ui'
import {
  Modal,
  Table,
  Icon,
  ToolBar,
  Divider,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import {
  FlexBox,
  Center,
  TextLink,
  Icons,
  Tooltip,
  FilterInput,
} from 'components'
import dayjs from 'dayjs'
import tw, { css } from 'twin.macro'
import {
  getJobInstanceKey,
  useMutationInstance,
  useQueryJobInstances,
  useStore,
} from 'hooks'
import { omitBy, get } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import useFilter from 'hooks/useHooks/useFilter'
import { InstanceState, JobInstanceTabletSuggestions } from '../constants'
import MessageModal from './MessageModal'

interface IFilter {
  state?: number
  instance_id?: string
  job_id?: string
  version?: string
  limit: number
  offset: number
  sort_by: string
  reverse: boolean
}

const { MenuItem } = Menu as any
const { ColumnsSetting } = ToolBar as any

const columnSettingsKey = 'ASSOIATE_INSTANCE_COLUMN_SETTINGS'

export const InstanceTable = observer(
  ({
    type = 'page',
  }: {
    type?: 'page' | 'modal'
    query?: any
    modalData?: any
  }) => {
    const { workFlowStore } = useStore()
    const history = useHistory()
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()

    const [messageVisible, setMessageVisible] = useState(false)
    const [currentRow, setCurrentRow] = useState(undefined)
    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )

    const { filter, setFilter, pagination, sort } = useFilter<
      IFilter,
      { pagination: true; sort: true }
    >(
      {
        sort_by: 'created',
        reverse: true,
        offset: 0,
        limit: 10,
      },
      { pagination: true, sort: true },
      columnSettingsKey
    )

    const queryClient = useQueryClient()
    const mutation = useMutationInstance()

    const { isFetching, isRefetching, data } = useQueryJobInstances(
      omitBy(filter, (v) => v === ''),
      type,
      { refetchInterval: 1000 * 60 }
    )
    const infos = get(data, 'infos', []) || []

    const refetchData = () => {
      queryClient.invalidateQueries(getJobInstanceKey())
    }

    const handleJobView = (curViewJobId: string) => {
      workFlowStore.set({ curViewJobId })
      history.push(`/${regionId}/workspace/${spaceId}/dm`)
    }

    const handleFinkUI = (row: any) => {
      if (row.state === 1) return
      mutation.mutate(
        { op: 'view', inst_id: row.id },
        {
          onSuccess: (response: any) => {
            const ele = document.createElement('a')
            ele.style.display = 'none'
            ele.target = '_blank'
            ele.href = `//${response?.web_ui || ''}`
            document.body.appendChild(ele)
            ele.click()
            document.body.removeChild(ele)
          },
        }
      )
    }

    const handleCheckRowDetail = (row: any) => {
      setCurrentRow(row)
      setMessageVisible(true)
    }

    const handleTerminate = (row: any) => {
      //  @ts-ignore
      Modal.warning({
        title: `终止作业实例: ${row.id}`,
        content: (
          <div tw="text-neut-8">
            实例终止后将取消运行，此操作无法撤回，您确定终止该实例吗？
          </div>
        ),
        okType: 'danger',
        okText: '终止',
        confirmLoading: mutation.isLoading,
        onOk: () => {
          mutation.mutate(
            {
              op: 'stop',
              instance_ids: [row.id],
            },
            {
              onSuccess: () => {
                refetchData()
              },
            }
          )
        },
      })
    }

    const handleMenuClick = (key: String, row: any) => {
      if (key === 'stop') {
        handleTerminate(row)
      } else if (key === 'view') {
        handleCheckRowDetail(row)
      }
    }

    const columns = [
      {
        title: '实例ID',
        dataIndex: 'id',
        width: 200,
        render: (value: string) => {
          return (
            <FlexBox tw="items-center space-x-1">
              <Center
                tw="bg-neut-13 rounded-full w-7 h-7 mr-1.5 border-2 border-solid border-neut-16"
                className="release-icon"
              >
                <Icons name="stream-job" size={16} />
              </Center>
              <div tw="flex-1 break-all">{value}</div>
            </FlexBox>
          )
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        filteredValue: filter.state,
        filters: Object.keys(InstanceState).map((el) => ({
          value: Number(el),
          text: InstanceState[el].name,
        })),
        hasAll: false,
        width: 120,
        render: (value: number) => {
          return (
            <div tw="flex items-center">
              <Icon tw="mr-2" name="radio" color={InstanceState[value].color} />
              {InstanceState[value].name}
            </div>
          )
        },
      },
      {
        title: '所属作业/ID',
        dataIndex: 'job_id',
        width: 185,
        render: (value: string, row: Record<string, any>) => {
          return (
            <div>
              {/* <div>{row.job_name}</div> */}
              <div
                tw="text-neut-8 hover:text-green-11 cursor-pointer"
                onClick={() => handleJobView(row.job_id)}
              >
                {value}
              </div>
            </div>
          )
        },
      },
      {
        title: '作业版本',
        width: 185,
        dataIndex: 'version',
      },
      {
        title: '创建时间',
        dataIndex: 'created',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'created' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: any) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '更新时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: any) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'table_actions',
        render: (_: any, row: Record<string, any>) => {
          return (
            <FlexBox tw="items-center">
              <Button type="text">
                <TextLink
                  onClick={() => handleFinkUI(row)}
                  disabled={row.state === 1}
                >
                  Flink UI
                </TextLink>
              </Button>
              <Divider
                type="vertical"
                height={20}
                style={{ borderColor: '#475569', margin: '0 14px 0 5px' }}
              />
              <Center>
                <Tooltip
                  trigger="click"
                  placement="bottom-end"
                  arrow={false}
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
                      onClick={(e: any, key: OP) => handleMenuClick(key, row)}
                    >
                      {[1, 2, 3].includes(row.state) && (
                        <MenuItem key="stop">终止</MenuItem>
                      )}
                      <MenuItem key="view">查看详情</MenuItem>
                    </Menu>
                  }
                >
                  <div tw="flex items-center p-0.5 cursor-pointer hover:bg-line-dark rounded-sm">
                    <Icon name="more" clickable changeable type="light" />
                  </div>
                </Tooltip>
              </Center>
            </FlexBox>
          )
        },
      },
    ]

    const handleFilterChange = useCallback(
      (filters: { state: number }) => {
        setFilter((draft: any) => {
          return {
            ...draft,
            state: Number(filters.state),
          }
        })
      },
      [setFilter]
    )

    const filterColumn = columnSettings
      .map((o: { key: string; checked: boolean }) => {
        return o.checked && columns.find((col) => col.dataIndex === o.key)
      })
      .filter((o: any) => o)

    return (
      <FlexBox orient="column">
        <FlexBox tw="gap-3 pt-5 pb-3 bg-neut-16">
          <FilterInput
            filterLinkKey={columnSettingsKey}
            suggestions={JobInstanceTabletSuggestions}
            tw="border-line-dark!"
            searchKey="job_name"
            placeholder="搜索关键字或输入过滤条件"
            // isMultiKeyword
            defaultKeywordLabel="实例ID"
          />
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
          <ColumnsSetting
            defaultColumns={columns}
            onSave={setColumnSettings}
            storageKey={columnSettingsKey}
          />
        </FlexBox>
        <Table
          rowKey="id"
          loading={isFetching || mutation.isLoading}
          dataSource={infos || []}
          columns={filterColumn.length > 0 ? filterColumn : columns}
          onSort={sort}
          onFilterChange={handleFilterChange}
          pagination={{
            total: get(data, 'total', 0),
            ...pagination,
          }}
        />

        <MessageModal
          visible={messageVisible}
          row={currentRow}
          cancel={() => setMessageVisible(false)}
          webUI={handleFinkUI}
        />
      </FlexBox>
    )
  }
)

export default {}
