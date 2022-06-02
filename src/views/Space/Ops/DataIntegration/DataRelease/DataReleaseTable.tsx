/* eslint-disable no-underscore-dangle */
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import React, { useMemo } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import { get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import useFilter from 'hooks/useHooks/useFilter'
import { observer } from 'mobx-react-lite'
import {
  Center,
  FlexBox,
  InstanceName,
  SelectTreeTable,
  TextEllipsis,
  Tooltip,
} from 'components'
import { getJobReleaseKey, useQuerySyncJobRelease } from 'hooks/useJobRelease'
import { listSyncJobVersions } from 'stores/api/syncJobVersion'
import { useParams } from 'react-router-dom'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import {
  DataReleaseActionType,
  dataReleaseColumns,
  DataReleaseDevMode,
  dataReleaseDevModeType,
  dataReleaseTabs,
} from '../constants'
import { getColumnsRender, getOperations } from './utils'
import { useDataReleaseStore } from './store'
import { VersionsModalContainer } from './VersionsModal'
import TableHeader from './TableHeader'

import DataSourceModal from './DataSourceModal'

interface IRouteParams {
  regionId: string
  spaceId: string
}

const TabsWrapper = styled.div`
  & .panel-right .icon svg.qicon {
    fill: hsla(0, 0%, 100%, 0.9);
    color: hsla(0, 0%, 100%, 0.4);
  }
`

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

const dataReleaseSettingKey = 'DATA_RELEASE_SETTING'

const DataRelease = observer(() => {
  const { showDataSource, selectedData, set } = useDataReleaseStore()
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      source?: string
      target?: string
      reverse?: boolean
      sort_by?: string
      job_type?: any
      alarm_status?: string
      status?: number
      offset: number
      limit: number
      verbose?: number
    },
    { pagination: true; sort: true }
  >(
    {
      sort_by: 'updated',
      reverse: true,
      verbose: 1,
    },
    { pagination: true, sort: true },
    dataReleaseSettingKey
  )

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(
      `./data-release/${record.id}?version=${record.version}${
        tab ? `&tab=${tab}` : ''
      }`,
      '_blank'
    )
  }

  const handleDatasource = (record: Record<string, any>) => {
    if (
      dataReleaseDevModeType[record.dev_mode as 1]?.type ===
      DataReleaseDevMode.UI
    ) {
      set({
        showDataSource: true,
        selectedData: record,
      })
    }
  }

  const columnsRender = getColumnsRender(filter, setFilter, undefined, {
    alarm_status: jumpDetail('alarm'),
    source: handleDatasource,
    target: handleDatasource,
  })

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
          showOffline: true,
          selectedData: record,
        })
        break
      case 'resume':
        set({
          showResume: true,
          selectedData: record,
        })
        break
      case 'suspend':
        set({
          showSuspend: true,
          selectedData: record,
        })
        break
      default:
        break
    }
  }

  const operations = getOperations(handleMenuClick, JobMode.DI)

  const jobNameColumn = {
    ...dataReleaseColumns[0],
    width: 250,
    render: (text: string, record: Record<string, any>) => {
      if (record.hasMore) {
        return (
          <span
            tw="text-green-11 cursor-pointer"
            onClick={() => {
              set({
                showVersion: true,
                selectedData: { id: record?.key },
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
            icon="q-downloadBoxFill"
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
    dataReleaseSettingKey,
    [jobNameColumn, ...dataReleaseColumns.slice(1)],
    columnsRender,
    operations
  )

  const columnsSetting = useMemo(
    () => ({
      columns: dataReleaseColumns,
      onSave: setColumnSettings as any,
      storageKey: dataReleaseSettingKey,
    }),
    [setColumnSettings]
  )

  const { data, isFetching } = useQuerySyncJobRelease(filter, {
    enabled: true,
    refetchInterval: 1000 * 60,
  })

  const infos = get(data, 'infos', []) || []

  const { regionId, spaceId } = useParams<IRouteParams>()

  const getChildren = async (uuid: string, record: Record<string, any>) => {
    const [key, version] = uuid.split('=-=')
    return listSyncJobVersions({
      regionId,
      spaceId,
      jobId: key,
      limit: 12,
      offset: 0,
    }).then((res) => {
      const arr = res.infos
        ?.filter((item: Record<string, any>) => item.version !== version)
        .map((i: any) => ({
          ...i,
          uuid: `${i.id}=-=${i.version}=-=${record.__level + 1}`,
        }))
      if (arr.length >= 11) {
        const value = arr.slice(0, 10).concat({
          key: arr[10].id,
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
        <TabsWrapper>
          <PageTab tabs={dataReleaseTabs} />
        </TabsWrapper>
        <FlexBox orient="column" tw="gap-3 p-5 bg-bgColor-light">
          <TableHeader columnsSetting={columnsSetting} />
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
        type={JobMode.DI}
        jobId={selectedData?.id}
        refetchDataKey={getJobReleaseKey()}
      />
      {showDataSource && (
        <DataSourceModal
          onCancel={() => {
            set({
              showDataSource: false,
            })
          }}
        />
      )}
    </>
  )
})

export default DataRelease
