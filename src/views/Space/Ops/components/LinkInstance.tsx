/* eslint-disable no-bitwise */
import { Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { Button, Select } from '@QCFE/lego-ui'

import { Center, FlexBox } from 'components/index'
// import useFilter from 'hooks/useHooks/useFilter'
import {
  dataJobInstanceColumns,
  jobInstanceStatus,
} from 'views/Space/Ops/DataIntegration/constants'
import React from 'react'
import { useIsFetching, useQueryClient } from 'react-query'
import JobInstanceTable from 'views/Space/Ops/DataIntegration/JobInstance/JobInstanceTable'
import { getSyncJobInstanceKey } from 'hooks/useSyncJobInstance'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { useImmer } from 'use-immer'

const linkInstanceSettingKey = 'LINK_INSTANCE_SETTING'

const LinkInstance = ({
  jobId,
  version,
  type = JobMode.DI,
}: {
  jobId: string
  version: string
  type?: JobMode
}) => {
  const [filter, setFilter] = useImmer<{
    job_id: string
    version: string
    instance_id?: string
    state?: number
  }>({ job_id: jobId, version })

  const queryClient = useQueryClient()
  const isFetching = useIsFetching()

  const refetchData = () => {
    queryClient.invalidateQueries(getSyncJobInstanceKey())
  }

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(`../data-job/${record.id}${tab ? `?tab=${tab}` : ''}`, '_blank')
  }
  return (
    <div tw="w-full">
      <FlexBox tw="gap-9 whitespace-nowrap ml-6">
        <Center tw="gap-1 ">
          <div tw="text-white w-auto">实例状态</div>
          <Select
            tw="w-[200px]"
            placeholder="请选择"
            options={[
              { value: '', label: '全部' },
              ...Object.values(jobInstanceStatus).map((v) => ({
                value: v.value,
                label: v.label,
              })),
            ]}
            onChange={(value: number) => {
              setFilter((draft) => {
                draft.state = value
              })
            }}
            value={filter.state}
          />
        </Center>
        {/* <Center tw="gap-1">
          <div tw="text-white w-auto ">告警状态</div>
          <Select
            tw="w-[200px]"
            placeholder="请选择"
            options={[
              { value: '', label: '全部' },
              ...Object.values(alarmStatus).map((v) => ({
                value: v.value,
                label: v.label,
              })),
            ]}
            onChange={(value: number) => {
              setFilter((draft) => {
                draft.alarm_status = value
              })
            }}
            value={filter.alarm_status}
          />
        </Center> */}
        <Center tw="gap-1">
          <div tw="text-white w-auto ">实例 ID</div>
          <InputSearch
            tw="w-[200px] flex-none border rounded border-line-dark"
            border
            placeholder="搜索实例 ID"
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
                refetchData()
              }}
            />
          </Button>
        </div>
      </FlexBox>
      <JobInstanceTable
        settingKey={linkInstanceSettingKey}
        defaultColumns={dataJobInstanceColumns.filter(
          (i) => !['job_id', 'type'].includes(i.key as any)
        )}
        filter={filter}
        showHeader={false}
        jumpDetail={jumpDetail}
        type={type}
      />
    </div>
  )
}

export default LinkInstance
