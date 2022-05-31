/* eslint-disable no-underscore-dangle */
import { useColumns } from 'hooks/useHooks/useColumns'
import {
  streamDevModeType,
  streamReleaseColumns,
  streamReleaseScheduleTypes,
  streamReleaseSuggestions,
  streamReleaseTabs,
} from 'views/Space/Ops/Stream1/common/constants'
import { Icon, PageTab, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { Button } from '@QCFE/lego-ui'
import {
  alarmStatus,
  DataReleaseActionType,
} from 'views/Space/Ops/DataIntegration/constants'
import { get, isNil, omitBy } from 'lodash-es'
import React, { useCallback } from 'react'
import { useIsFetching, useQueryClient } from 'react-query'
import { MappingKey } from 'utils/types'
import { streamReleaseFieldMapping } from 'views/Space/Ops/Stream1/common/mappings'
import dayjs from 'dayjs'
import useFilter from 'hooks/useHooks/useFilter'
import {
  Center,
  FilterInput,
  InstanceName,
  SelectTreeTable,
  TextEllipsis,
  Tooltip,
  FlexBox,
} from 'components'
import { getOperations } from 'views/Space/Ops/DataIntegration/DataRelease/utils'
import {
  AlarmStatusCmp,
  StreamReleaseStatusCmp,
} from 'views/Space/Ops/styledComponents'
import { getReleaseJobsKey, useQueryReleaseJobs } from 'hooks'
import tw, { css } from 'twin.macro'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { streamJobVersionManage } from 'stores/api'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { VersionsModalContainer } from '../DataIntegration/DataRelease/VersionsModal'

const { ColumnsSetting } = ToolBar as any

const getName = (name: MappingKey<typeof streamReleaseFieldMapping>) =>
  streamReleaseFieldMapping.get(name)!.apiField

const streamReleaseSettingKey = 'STREAM_RELEASE_SETTING'

const jobNameStyle = css`
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
const StreamRelease = observer(() => {
  const {
    filter,
    // setFilter,
    pagination,
    sort,
    getColumnFilter: getFilter,
    getColumnSort: getSort,
  } = useFilter<
    Record<ReturnType<typeof getName>, string | number | boolean>,
    { pagination: true; sort: true }
  >(
    {
      reverse: true,
      sort_by: getName('lastPublishTime'),
    },
    { pagination: true, sort: true },
    streamReleaseSettingKey
  )

  const { set, selectedData } = useDataReleaseStore()
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
      render: (text: string) => {
        return <span tw="text-neut-8">{text}</span>
      },
    },
    [getName('status')]: {
      ...getFilter(getName('status'), streamReleaseScheduleTypes),
      render: (type: number, record: Record<string, any>) => {
        if (record.__level !== 1) {
          return null
        }
        return <StreamReleaseStatusCmp type={type as 1} />
      },
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
            tw="inline-block border px-1.5 text-white border-white rounded-sm"
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
        set({
          selectedData: record,
          showOffline: true,
        })
        break
      case 'resume':
        set({
          selectedData: record,
          showResume: true,
        })
        break
      case 'suspend':
        set({
          selectedData: record,
          showSuspend: true,
        })
        break
      default:
        break
    }
  }

  const operations = getOperations(handleMenuClick, JobMode.RT)
  const [jobName, ...rest] = streamReleaseColumns
  const jobNameColumn = {
    ...jobName,
    width: 250,
    render: (text: string, record: Record<string, any>) => {
      if (record.hasMore) {
        return (
          <span
            tw="text-green-11 cursor-pointer"
            onClick={() => {
              set({
                selectedData: record,
                showVersion: true,
              })
            }}
          >
            查看全部 →
          </span>
        )
      }

      if (record.hasNone) {
        return <span tw="text-neut-8">暂无历史版本</span>
      }

      if (record.__level > 1) {
        return (
          <TextEllipsis>
            <span
              tw="hover:text-green-11 hover:cursor-pointer"
              onClick={() => jumpDetail()(record)}
            >
              {text}
            </span>
          </TextEllipsis>
        )
      }
      const child = (
        <Center tw="truncate" css={jobNameStyle}>
          <InstanceName
            theme="dark"
            icon={
              streamDevModeType[
                get(record, getName('devMode') as string, 1) as 1
              ]?.icon
            }
            name={record.name}
            desc={record.id}
            onClick={() => jumpDetail()(record)}
          />
        </Center>
      )
      if (record.desc) {
        return (
          <Tooltip theme="light" hasPadding content={record.desc}>
            {child}
          </Tooltip>
        )
      }
      return child
    },
  }

  const { columns, setColumnSettings } = useColumns(
    streamReleaseSettingKey,
    [jobNameColumn, ...rest],
    columnsRender as any,
    operations
  )

  // const mutation = useMutationUdfReleaseJobs()

  const isFetching = useIsFetching()
  const { data } = useQueryReleaseJobs(omitBy(filter, isNil), {
    refetchInterval: 1000 * 60,
  })

  const infos = get(data, 'infos', []) || []

  const queryClient = useQueryClient()
  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(getReleaseJobsKey())
  }, [queryClient])

  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()

  const getChildren = async (uuid: string) => {
    const [key, version] = uuid.split('=-=')
    return streamJobVersionManage
      .listStreamJobVersions({
        regionId,
        space_id: spaceId,
        job_id: key,
        limit: 11,
        offset: 0,
      })
      .then((res) => {
        const arr = res.infos
          ?.filter((item: Record<string, any>) => item.version !== version)
          ?.map((i: any) => ({
            ...i,
            uuid: `${i.id}=-=${i.version}`,
          }))
        if (arr.length >= 11) {
          const value = arr.slice(0, 10).concat({
            key: Math.random().toString(32),
            uuid: Math.random().toString(32),
            id: key,
            hasMore: true,
          })
          return value
        }
        if (arr.length === 0) {
          return [{ key: Math.random().toString(32), hasNone: true }]
        }
        return arr
      })
  }

  return (
    <>
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
          <SelectTreeTable
            openLevel={1}
            indentSpace={44}
            selectedLevel={-1}
            getChildren={getChildren}
            columns={columns}
            dataSource={infos.map((i: any) => {
              return {
                ...i,
                uuid: `${i.id}=-=${i.version}`,
              }
            })}
            loading={!!isFetching}
            onSort={sort}
            rowKey="uuid"
            pagination={{
              total: get(data, 'total', 0),
              ...pagination,
            }}
          />
        </FlexBox>
      </FlexBox>
      <VersionsModalContainer
        type={JobMode.RT}
        jobId={selectedData?.id}
        refetchDataKey={getReleaseJobsKey()}
      />
    </>
  )
})

export default StreamRelease
