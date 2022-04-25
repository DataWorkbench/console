import { useColumns } from 'hooks/useHooks/useColumns'
import {
  dataReleaseScheduleType,
  streamDevModeType,
  streamReleaseColumns,
  streamReleaseSuggestions,
  streamReleaseTabs,
} from 'views/Space/Ops/Sream1/common/constants'
import { FlexBox } from 'components/Box'
import { PageTab, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { Button, Icon } from '@QCFE/lego-ui'
import { alarmStatus } from 'views/Space/Ops/DataIntegration/constants'
import { Table } from 'views/Space/styled'
import { get } from 'lodash-es'
import React from 'react'
import { useIsFetching } from 'react-query'
import { MappingKey } from 'utils/types'
import { streamReleaseFieldMapping } from 'views/Space/Ops/Sream1/common/mappings'
import dayjs from 'dayjs'
import useFilter from 'hooks/useHooks/useFilter'
import { FilterInput } from 'components'

const { ColumnsSetting } = ToolBar as any

const getName = (name: MappingKey<typeof streamReleaseFieldMapping>) =>
  streamReleaseFieldMapping.get(name)!.apiField

const streamReleaseSettingKey = 'STREAM_RELEASE_SETTING'

const StreamRelease = () => {
  const {
    filter,
    setFilter,
    pagination,
    sort,
    getColumnFilter: getFilter,
    getColumnSort: getSort,
  } = useFilter<
    Record<ReturnType<typeof getName>, number>,
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, streamReleaseSettingKey)
  console.log(filter, setFilter)

  const columnsRender = {
    [getName('versionId')]: {
      // TODO: render
      render: (text: string) => {
        return <span tw="text-neut-8">{text}</span>
      },
    },
    [getName('status')]: {
      ...getFilter(getName('status'), dataReleaseScheduleType),
      // TODO: render
    },
    [getName('alarmStatus')]: {
      ...getFilter(getName('alarmStatus'), alarmStatus),
      // TODO: render
    },
    [getName('devMode')]: {
      ...getFilter(getName('devMode'), streamDevModeType),
      // TODO: render
    },
    [getName('lastPublishTime')]: {
      ...getSort(getName('lastPublishTime')),
      render: (d: number) => {
        return (
          d && (
            <span tw="text-neut-8">
              {dayjs(d * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          )
        )
      },
    },
  }
  const operations = {}

  const { columns, setColumnSettings } = useColumns(
    streamReleaseSettingKey,
    streamReleaseColumns,
    columnsRender as any,
    operations
  )

  // const queryClient = useQueryClient()
  const isFetching = useIsFetching()

  // const refetchData = () => {
  // queryClient.invalidateQueries(getJobReleaseKey())
  // }

  const { data } = { data: { infos: [] } }
  const infos = get(data, 'infos', [])

  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={streamReleaseTabs} />
      <FlexBox orient="column" tw="gap-3 p-5 bg-neut-16">
        <FlexBox tw=" gap-2">
          <FilterInput
            filterLinkKey={streamReleaseSettingKey}
            suggestions={streamReleaseSuggestions}
            tw="border-line-dark!"
            searchKey="job_name"
            placeholder="搜索关键字或输入过滤条件"
            // isMultiKeyword
            defaultKeywordLabel="作业名称"
          />

          <Button
            type="black"
            onClick={() => {
              // refetchData()
            }}
            loading={!!isFetching}
            tw="px-[5px] border-line-dark!"
          >
            <Icon name="if-refresh" tw="text-xl text-white" type="light" />
          </Button>
          <ColumnsSetting
            defaultColumns={streamReleaseColumns}
            storageKey={streamReleaseSettingKey}
            onSave={setColumnSettings}
          />
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

export default StreamRelease
