/* eslint-disable */
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import React, { useMemo } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import { get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import useFilter from 'hooks/useHooks/useFilter'
import { observer } from 'mobx-react-lite'
import {
  SelectTreeTable,
  FlexBox,
  TextEllipsis,
  Center,
  InstanceName,
  Tooltip,
} from 'components'
import { Circle } from 'views/Space/Ops/DataIntegration/styledComponents'
import { Icon } from '@QCFE/lego-ui'
import {
  dataReleaseColumns,
  DataReleaseDevMode,
  dataReleaseDevModeType,
  dataReleaseTabs,
  JobType,
  jobType,
} from '../constants'
import { getColumnsRender, getOperations } from './utils'
import { useDataReleaseStore } from './store'
import VersionsModal from './VersionsModal'
import TableHeader from './TableHeader'

import DataSourceModal from './DataSourceModal'
import { useHistory } from 'react-router-dom'
// import { IColumn } from 'hooks/utils'

// interface IDataReleaseProps {}

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
// const columns: IColumn[] = []
const DataRelease = observer(() => {
  const { showDataSource, showVersion, set } = useDataReleaseStore()
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      source?: string
      target?: string
      reverse?: 'asc' | 'desc'
      sort_by?: string
      job_type?: any
      alarm_status?: string
      schedule_status?: number
      offset: number
      limit: number
    },
    { pagination: true; sort: true }
  >({})

  const history = useHistory()
  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(`./${record.id}${tab ? `?tab=${tab}` : ''}`, 'target')
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

  const handleMenuClick = () => {
    console.log('handleMenuClick')
  }

  const operations = getOperations(handleMenuClick)

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
                selectedData: record,
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
        return <TextEllipsis>{text}</TextEllipsis>
      }
      const child = (
        <Center tw="truncate" css={jobNameStyle}>
          <InstanceName
            theme={'dark'}
            icon={'q-downloadBoxFill'}
            name={'asfda'}
            desc={'asfdasdf'}
          />
        </Center>
      )
      if (record.desc) {
        // TODO: 描述字段未确认
        return (
          <Tooltip theme={'light'} hasPadding content={record.desc}>
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

  const { data, isFetching } = {
    data: {
      infos: [
        {
          id: 1,
          job_name: 'aaaa',
          desc: 'asdasdfas',
          source: 'MySQL',
          alarm_status: '1',
        },
      ],
    },
    isFetching: false,
  }
  // local.testing.com/dataomnis/testing/workspace/wks-yrl0o4ex205vkr9y/ops/data-release
  const infos = get(data, 'infos', [])

  return (
    <>
      <FlexBox orient="column" tw="p-5 h-full">
        <TabsWrapper>
          <PageTab tabs={dataReleaseTabs} />
        </TabsWrapper>
        <FlexBox orient="column" tw="gap-3">
          <TableHeader columnsSetting={columnsSetting} />
          <SelectTreeTable
            openLevel={1}
            indentSpace={44}
            selectedLevel={-1}
            getChildren={async (key) => [
              {
                id: `${key}as`,
                job_name: `${key}asdf`,
                // hasNone: true,
                hasMore: true,
              },
            ]}
            columns={columns}
            dataSource={infos}
            loading={!!isFetching}
            sort={sort}
            pagination={{
              total: get(data, 'total', 0),
              ...pagination,
            }}
          />
        </FlexBox>
      </FlexBox>
      {showVersion && (
        <VersionsModal
          onCancel={() => {
            set({
              showVersion: false,
            })
          }}
        />
      )}
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
