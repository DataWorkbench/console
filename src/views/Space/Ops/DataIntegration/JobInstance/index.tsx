/* eslint-disable no-bitwise */
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import React from 'react'
import useIcon from 'hooks/useHooks/useIcon'
import JobInstanceTable from 'views/Space/Ops/DataIntegration/JobInstance/JobInstanceTable'
import { dataJobInstanceColumns, dataJobInstanceTab } from '../constants'
import icons from '../../icons'

const settingKey = 'DATA_JOB_INSTANCE_TABLE_SETTING'

const DataJobInstance = () => {
  useIcon(icons)
  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(`./data-job/${record.id}${tab ? `?tab=${tab}` : ''}`, '_blank')
  }
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={dataJobInstanceTab} />
      <FlexBox orient="column" tw="gap-3 p-5 bg-bgColor-light">
        <JobInstanceTable
          settingKey={settingKey}
          defaultColumns={dataJobInstanceColumns}
          showHeader
          filter={{}}
          jumpDetail={jumpDetail}
        />
      </FlexBox>
    </FlexBox>
  )
}

export default DataJobInstance
