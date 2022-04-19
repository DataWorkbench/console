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
import { getColumnsRender, getOperations } from './utils'

interface IProps {
  onCancel: () => void
}

const dataReleaseVersionSettingKey = 'DATA_RELEASE_VERSION_SETTING'

const VersionsModal = observer((props: IProps) => {
  const { set } = useDataReleaseStore()
  const { onCancel } = props
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      reverse?: 'asc' | 'desc'
      sort_by?: string
      alarm_status?: string
      schedule_status?: number
      offset: number
      limit: number
    },
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, dataReleaseVersionSettingKey)

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(`./${record.id}${tab ? `?tab=${tab}` : ''}`, '_blank')
  }

  const columnsRender = getColumnsRender(filter, setFilter, [
    'alarm_status',
    'schedule_status',
    'version_id',
    'created_at',
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
    width: 250,
    render: (text: string, record: Record<string, any>) => {
      const child = (
        <TextEllipsis>
          <span tw="hover:text-green-11" onClick={() => jumpDetail()(record)}>
            {text}
          </span>
        </TextEllipsis>
      )
      if (record.desc) {
        // TODO: 描述字段未确认
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

  const data: Record<string, any> = {
    infos: [
      {
        id: 1,
        desc: 'adfasdfa',
        job_name: ';asdas',
        instance_id: 1,
        instance_name: 'adfasdfas',
      },
    ],
  }
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
            rowKey="id"
            columns={columns}
            dataSource={data?.infos || []}
            sort={sort}
            pagination={{
              total: data.total ?? 0,
              ...pagination,
            }}
          />
        </FlexBox>
      </ModalContent>
    </Modal>
  )
})
export default VersionsModal
