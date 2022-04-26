/* eslint-disable no-bitwise */
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Button, InputSearch, Select } from '@QCFE/lego-ui'
import { Center, FlexBox } from 'components'
import useFilter from 'hooks/useHooks/useFilter'
import {
  dataJobInstanceColumns,
  dataReleaseScheduleType,
} from 'views/Space/Ops/DataIntegration/constants'
import React from 'react'
import { useIsFetching, useQueryClient } from 'react-query'
import JobInstanceTable from 'views/Space/Ops/DataIntegration/JobInstance/JobInstanceTable'
import { getSyncJobInstanceKey } from 'hooks/useJobInstance'

const linkInstanceSettingKey = 'LINK_INSTANCE_SETTING'

const LinkInstance = ({
  jobId,
  version,
  type,
}: {
  jobId: string
  version: string
  type?: 'stream' | 'sync'
}) => {
  const { filter, setFilter } = useFilter<
    {
      job_id: string
      version: string
      instance_id?: string
      state?: number
      alarm_status?: number
    },
    {
      pagination: true
      sort: true
    }
  >({ job_id: jobId, version })

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
      <FlexBox tw="gap-9 whitespace-nowrap">
        <Center tw="gap-1 ">
          <div tw="text-white w-auto">实例状态</div>
          <Select
            tw="w-[200px]"
            placeholder="请选择"
            options={[
              { value: 0, label: '全部' },
              ...Object.values(dataReleaseScheduleType).map((v) => ({
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
        filter={{
          ...filter,
          job_id: jobId,
          version,
        }}
        showHeader={false}
        jumpDetail={jumpDetail}
        type={type}
      />
    </div>
  )
}

export default LinkInstance
