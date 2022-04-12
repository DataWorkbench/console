import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import {
  dataReleaseColumns,
  dataReleaseTabs,
} from 'views/Space/Ops/DataIntegration/constants'
import { Table } from 'views/Space/styled'
import React, { useMemo } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import { get } from 'lodash-es'
import { styled } from 'twin.macro'
import useFilter from 'hooks/useHooks/useFilter'
import { observer } from 'mobx-react-lite'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelase/store'
import {
  getColumnsRender,
  getOperations,
} from 'views/Space/Ops/DataIntegration/DataRelase/utils'
import VersionsModal from './VersionsModal'
import TableHeader from './TableHeader'

import DataSourceModal from './DataSourceModal'
// import { IColumn } from 'hooks/utils'

// interface IDataReleaseProps {}

const TabsWrapper = styled.div`
  & .panel-right .icon svg.qicon {
    fill: hsla(0, 0%, 100%, 0.9);
    color: hsla(0, 0%, 100%, 0.4);
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

  const columnsRender = getColumnsRender(filter, setFilter)

  const handleMenuClick = () => {
    console.log('handleMenuClick')
  }

  const operations = getOperations(handleMenuClick)

  const { columns, setColumnSettings } = useColumns(
    dataReleaseSettingKey,
    dataReleaseColumns,
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
    data: { infos: [{ id: 1, job_name: 'aaaa' }] },
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
          <Table
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
