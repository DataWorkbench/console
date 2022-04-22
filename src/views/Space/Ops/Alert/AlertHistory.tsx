import useIcon from 'hooks/useHooks/useIcon'
import { PageTab, Icon, Button, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, InstanceName } from 'components'
import { Table } from 'views/Space/styled'
import { get } from 'lodash-es'
import React from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import tw, { css } from 'twin.macro'
import dayjs from 'dayjs'
import { alertHistoryColumns, alertHistoryTabs } from './common/constants'
import icons from './common/icons'
import useFilter from '../../../../hooks/useHooks/useFilter'

interface IAlertHistory {}

const instanceNameStyle = css`
  &:hover {
    .instance-name-title {
      ${tw`text-green-11`}
    }
    .instance-name-icon {
      ${tw`bg-[#13966a80] border-[#9ddfc966]`}
      .icon svg.qicon {
        ${tw`text-green-11`}
      }
    }
  }
`

const alertHistorySettingKey = 'ALERT_HISTORY_SETTING_KEY'
const AlertHistory = (props: IAlertHistory) => {
  useIcon(icons)
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      search?: string
    },
    { pagination: true; sort: true }
  >({})

  console.log(props, filter)
  const { columns } = useColumns(alertHistorySettingKey, alertHistoryColumns, {
    alert_content: {
      render: (text, record) => {
        return (
          <InstanceName
            theme="dark"
            name={text}
            desc={record.id}
            css={instanceNameStyle}
          />
        )
      },
    },
    created_at: {
      render: (v) => (
        <span tw="text-neut-8">
          {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
  })

  const { data, isFetching } = { data: {}, isFetching: true }

  const infos = get(data, 'infos', [])
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={alertHistoryTabs} />
      <FlexBox orient="column" tw="gap-3 p-5 bg-neut-16">
        <FlexBox tw="justify-end gap-2">
          <InputSearch
            tw="w-64! flex-none border border-line-dark"
            placeholder="请输入关键词进行搜索"
            onPressEnter={(evt) => {
              setFilter((_) => {
                _.search = String((evt.target as HTMLInputElement).value)
                _.offset = 0
              })
            }}
            onClear={() => {
              setFilter((_) => {
                if (_.search) {
                  _.search = ''
                  _.offset = 0
                }
              })
            }}
          />
          <Button
            type="black"
            loading={!!isFetching}
            tw="px-[5px] border-line-dark!"
          >
            <Icon
              name="if-refresh"
              tw="text-xl text-white"
              type="light"
              onClick={() => {
                // refetch()
              }}
            />
          </Button>
        </FlexBox>
        <Table
          columns={columns}
          dataSource={infos}
          loading={!!isFetching}
          onSort={sort}
          pagination={{
            total: get(data, 'total', 0),
            ...pagination,
          }}
        />
      </FlexBox>
    </FlexBox>
  )
}
export default AlertHistory
