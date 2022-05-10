import { useColumns } from 'hooks/useHooks/useColumns'
import {
  streamDevModeType,
  streamReleaseColumns,
  streamReleaseScheduleTypes,
  streamReleaseSuggestions,
  streamReleaseTabs,
} from 'views/Space/Ops/Stream1/common/constants'
import { FlexBox } from 'components/Box'
import { Icon, PageTab, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { Button } from '@QCFE/lego-ui'
import {
  alarmStatus,
  DataReleaseActionType,
} from 'views/Space/Ops/DataIntegration/constants'
import { Table } from 'views/Space/styled'
import { get, isNil, omitBy } from 'lodash-es'
import React, { useCallback } from 'react'
import { useIsFetching, useQueryClient } from 'react-query'
import { MappingKey } from 'utils/types'
import { streamReleaseFieldMapping } from 'views/Space/Ops/Stream1/common/mappings'
import dayjs from 'dayjs'
import useFilter from 'hooks/useHooks/useFilter'
import { FilterInput } from 'components'
import { getOperations } from 'views/Space/Ops/DataIntegration/DataRelease/utils'
import {
  AlarmStatusCmp,
  StreamReleaseStatusCmp,
} from 'views/Space/Ops/styledComponents'
import { getReleaseJobsKey, useQueryReleaseJobs } from 'hooks'
import { css } from 'twin.macro'

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

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(
      `./release/${record.id}?version=${record[getName('versionId')]}${
        tab ? `&tab=${tab}` : ''
      }`,
      '_blank'
    )
  }
  const columnsRender = {
    [getName('versionId')]: {
      // TODO: render
      render: (text: string) => {
        return <span tw="text-neut-8">{text}</span>
      },
    },
    [getName('status')]: {
      ...getFilter(getName('status'), streamReleaseScheduleTypes),
      render: (type: number) => <StreamReleaseStatusCmp type={type as 1} />,
    },
    [getName('alarmStatus')]: {
      ...getFilter(getName('alarmStatus'), alarmStatus),
      render: (type: number, record: Record<string, any>) => (
        <AlarmStatusCmp
          type={type as any}
          onClick={() => jumpDetail('alert')(record)}
        />
      ),
    },
    [getName('devMode')]: {
      ...getFilter(getName('devMode'), streamDevModeType),
      render: (type?: keyof typeof streamDevModeType) =>
        !isNil(type) && (
          <span
            tw="border px-1.5 text-white border-white rounded-sm"
            css={css`
              transform: scale(0.8);
            `}
          >
            {streamDevModeType[type]?.label}
          </span>
        ),
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

  const handleMenuClick = (
    record: Record<string, any>,
    key: DataReleaseActionType
  ) => {
    switch (key) {
      case 'link':
      case 'dev':
      case 'cluster':
      case 'alarm':
      case 'schedule':
        jumpDetail(key)(record)
        break
      case 'offline':
        // set({
        //   showOffline: true,
        //   selectedData: record,
        // })
        break
      case 're-publish':
        // mutation
        //   .mutateAsync({
        //     op: 'release',
        //     jobId: record.id,
        //   })
        //   .then(() => {
        //     refetchData()
        //   })

        break
      default:
        break
    }
  }

  const operations = getOperations(handleMenuClick)

  const { columns, setColumnSettings } = useColumns(
    streamReleaseSettingKey,
    streamReleaseColumns,
    columnsRender as any,
    operations
  )

  // const mutation = useMutationUdfReleaseJobs()

  const isFetching = useIsFetching()
  const { data } = useQueryReleaseJobs(omitBy(filter, isNil))

  const infos = get(data, 'infos', []) || []
  //

  const queryClient = useQueryClient()
  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(getReleaseJobsKey())
  }, [queryClient])

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
              refetchData()
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
