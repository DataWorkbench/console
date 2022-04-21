import { Table } from 'views/Space/styled'
import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import tw, { css } from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Button, InputSearch, Select } from '@QCFE/lego-ui'
import { Center, FlexBox } from 'components'
import { get } from 'lodash-es'
import useFilter from 'hooks/useHooks/useFilter'

const defaultColumns: IColumn[] = [
  {
    title: '实例 ID',
    dataIndex: 'instance_id',
    key: 'instance_id',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '告警状态',
    dataIndex: 'alarm_status',
    key: 'alarm_status',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
  },
]

const linkInstanceSettingKey = 'LINK_INSTANCE_SETTING'

const LinkInstance = () => {
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      instance_id?: string
      status?: number
      alarm_status?: number
    },
    {
      pagination: true
      sort: true
    }
  >({})

  const { data, refetch, isFetching } = {
    refetch: () => {},
    isFetching: false,
    data: [],
  }

  const columnsRender = {

  }

  const operations = {
    title: '操作',
    key: 'operation',
    render: (text: any, record: any) => (
      <span>
        <a href="javascript:;">查看</a>
        <span className="ant-divider" />
        <a href="javascript:;">编辑</a>
        <span className="ant-divider" />
        <a href="javascript:;">删除</a>
      </span>
    ),
  }
  const { columns } = useColumns(
    linkInstanceSettingKey,
    defaultColumns,
    columnsRender,
    operations
  )

  console.log(pagination)
  return (
    <div tw="w-full">
      <FlexBox tw="gap-9 whitespace-nowrap">
        <Center tw="gap-1 ">
          <div tw="text-white w-auto">调度状态</div>
          <Select
            tw="w-[200px]"
            placeholder="请选择"
            options={[
              { value: 0, label: '全部' },
              { value: 1, label: '调度中' },
              { value: 2, label: '已暂停' },
              { value: 4, label: '已完成' },
            ]}
            onChange={(value: number) => {
              setFilter((draft) => {
                draft.status = value
              })
            }}
            value={filter.status}
          />
        </Center>
        <Center tw="gap-1">
          <div tw="text-white w-auto ">告警状态</div>
          <Select
            tw="w-[200px]"
            placeholder="请选择"
            options={[
              { value: 0, label: '全部' },
              { value: 1, label: '正常' },
              { value: 2, label: '告警' },
            ]}
            onChange={(value: number) => {
              setFilter((draft) => {
                draft.alarm_status = value
              })
            }}
            value={filter.alarm_status}
          />
        </Center>
        <Center tw="gap-1">
          <div tw="text-white w-auto ">作业 ID</div>
          <InputSearch
            tw="w-[200px]"
            placeholder="搜索作业 ID"
            onPressEnter={(e: React.SyntheticEvent) => {
              setFilter((draft) => {
                draft.instance_id = (e.currentTarget as HTMLInputElement).value
              })
            }}
            onClear={() => {
              setFilter((draft) => {
                draft.instance_id = ''
              })
            }}
          />
        </Center>
        <div tw="text-right flex-auto">
          <Button
            type="black"
            loading={!!isFetching}
            tw="w-auto px-[5px] border-line-dark!"
          >
            <Icon
              name="if-refresh"
              tw="text-xl text-white"
              type="light"
              onClick={() => {
                refetch()
              }}
            />
          </Button>
        </div>
      </FlexBox>
      <Table
        tw="mt-2"
        css={css`
          .grid-table-header {
            ${tw`bg-[#1e2f41]!`}
          }
        `}
        columns={columns}
        dataSource={[]}
        sort={sort}
        pagination={{
          total: get(data, 'total', 0),
          ...pagination,
        }}
      />
    </div>
  )
}

export default LinkInstance
