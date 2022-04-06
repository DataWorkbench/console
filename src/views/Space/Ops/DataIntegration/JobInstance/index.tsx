import { Icon, PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import { useColumns } from 'hooks/utils'
import { Table } from 'views/Space/styled'
import { TextLink, TextEllipsis, Tooltip } from 'components'
import React, { useMemo } from 'react'
import { Center } from 'components/Center'
import tw, { styled } from 'twin.macro'
import { JobStatus } from 'views/Space/Ops/DataIntegration/styledComponents'
import { Menu } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'
import {
  dataJobInstanceColumns,
  dataJobInstanceTab,
  jobStatus,
} from '../constants'
import TableHeader from './TableHeader'

const { MenuItem } = Menu as any

const settingKey = 'DATA_JOB_INSTANCE_TABLE_SETTING'

const Circle = styled.div`
  ${tw`inline-flex items-center justify-center w-6 h-6 rounded-full text-white bg-line-dark mr-2 flex-none`}
`
const DataJobInstance = () => {
  const [filter, setFilter] = useImmer<{
    status: string
    offset: number
  }>({ offset: 0, status: '' })
  const columnsRender = {
    instance_id: {
      render: (text: string) => (
        <Center tw="truncate">
          {/* // TODO merge fill icon */}
          <Circle>
            <Icon name="branch" />
          </Circle>
          <div tw="flex-1 truncate">
            <TextEllipsis theme="light">{text}</TextEllipsis>
          </div>
        </Center>
      ),
    },
    status: {
      title: (
        <FlexBox tw="items-center">
          <span>状态</span>
          <Tooltip
            trigger="click"
            placement="bottom-start"
            content={
              <Menu
                selectedKey={String(filter.status || 'all')}
                onClick={(e: React.SyntheticEvent, k: string, v: number) => {
                  setFilter((draft) => {
                    draft.status = v
                    draft.offset = 0
                  })
                }}
              >
                <MenuItem value="" key="all">
                  全部
                </MenuItem>
                {Object.values(jobStatus).map(({ value, label }) => (
                  <MenuItem value={value} key={value}>
                    <FlexBox tw="justify-between flex-auto">
                      <span>{label}</span>
                      {filter.status === value && (
                        <Icon name="check" tw="ml-4" size={16} type="light" />
                      )}
                    </FlexBox>
                  </MenuItem>
                ))}
              </Menu>
            }
          >
            <Icon name="filter" type="light" clickable tw="ml-1 block" />
          </Tooltip>
        </FlexBox>
      ),
      render: (text: keyof typeof JobStatus) => <JobStatus type={text} />,
    },
    alarm_status: {},
    job_id: {},
    job_type: {},
    create_time: {},
    update_time: {},
  }
  const operations = {
    title: '操作',
    key: 'operation',
    render: (_: never, record: Record<string, any>) => {
      console.log(record)
      return (
        <div>
          <TextLink />
        </div>
      )
    },
  }

  const { columns, setColumnSettings } = useColumns(
    settingKey,
    dataJobInstanceColumns,
    columnsRender,
    operations
  )
  const columnsSetting = useMemo(() => {
    console.log(11111111111111)
    return {
      defaultColumns: dataJobInstanceColumns,
      storageKey: settingKey,
      onSave: setColumnSettings as any,
    }
  }, [setColumnSettings])

  console.log(columnsSetting)
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={dataJobInstanceTab} />
      <FlexBox orient="column" tw="gap-3">
        <TableHeader columnsSetting={columnsSetting} />
        <Table
          columns={columns}
          dataSource={[
            {
              instance_id: '122222222222222222222333333',
              status: '1',
              alarm_status: '1',
              job_id: '1',
              job_type: '1',
              create_time: '1',
              update_time: '1',
            },
          ]}
        />
      </FlexBox>
    </FlexBox>
  )
}

export default DataJobInstance
