import { FlexBox, Modal, ModalContent, TextEllipsis, Tooltip } from 'components'
import { observer } from 'mobx-react-lite'
import useFilter from 'hooks/useHooks/useFilter'
import {
  DataReleaseActionType,
  dataReleaseColumns,
  versionColumns,
} from 'views/Space/Ops/DataIntegration/constants'
import React, { useMemo } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import TableHeader from 'views/Space/Ops/DataIntegration/DataRelease/TableHeader'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import { useQuerySyncJobVersions } from 'hooks/useJobVersion'
import { getColumnsRender, getOperations } from './utils'

interface IProps {
  onCancel: () => void
}

const dataReleaseVersionSettingKey = 'DATA_RELEASE_VERSION_SETTING'

const VersionsModal = observer((props: IProps) => {
  const { set, selectedData } = useDataReleaseStore()
  const { onCancel } = props
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      reverse?: 'asc' | 'desc'
      sort_by?: string
      alarm_status?: string
      status?: number
      offset: number
      limit: number
      jobId: string
    },
    { pagination: true; sort: true },
    dataReleaseVersionSettingKey
  >(
    { limit: 15, jobId: selectedData?.key },
    { pagination: true, sort: true },
    dataReleaseVersionSettingKey
  )

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(
      `./data-release/${record.id}?version=${record.version}${
        tab ? `&tab=${tab}` : ''
      }`,
      '_blank'
    )
  }

  const columnsRender = getColumnsRender(filter, setFilter, [
    'alarm_status',
    'status',
    'version',
    'updated',
  ])

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
      case 're-publish':
        break
      default:
        break
    }
  }

  const operations = getOperations(handleMenuClick)
  const jobNameColumn = {
    ...dataReleaseColumns[0],
    // width: 250,
    render: (text: string, record: Record<string, any>) => {
      const child = (
        <TextEllipsis>
          <span
            tw="hover:text-green-11 hover:cursor-pointer"
            onClick={() => jumpDetail()(record)}
          >
            {text}
          </span>
        </TextEllipsis>
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
    dataReleaseVersionSettingKey,
    [jobNameColumn, ...versionColumns.slice(1)],
    columnsRender,
    operations
  )
  const columnsSetting = useMemo(
    () => ({
      columns: versionColumns,
      onSave: setColumnSettings as any,
      storageKey: dataReleaseVersionSettingKey,
    }),
    [setColumnSettings]
  )
  const { data } = useQuerySyncJobVersions(filter)
  return (
    <Modal
      width={800}
      onCancel={onCancel}
      appendToBody
      footer={null}
      orient="fullright"
      visible
      title="历史版本"
    >
      <ModalContent>
        <FlexBox orient="column" tw="gap-3">
          <TableHeader columnsSetting={columnsSetting} />
          <Table
            columns={columns}
            dataSource={data?.infos || []}
            onSort={sort}
            rowKey="version"
            pagination={{
              total: data?.total ?? 0,
              ...pagination,
            }}
          />
        </FlexBox>
      </ModalContent>
    </Modal>
  )
})
export default VersionsModal
