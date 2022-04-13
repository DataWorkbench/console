import { FlexBox, Modal, ModalContent } from 'components'
import { observer } from 'mobx-react-lite'
import useFilter from 'hooks/useHooks/useFilter'
import { versionColumns } from 'views/Space/Ops/DataIntegration/constants'
import React, { useMemo } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import TableHeader from 'views/Space/Ops/DataIntegration/DataRelease/TableHeader'
import { getColumnsRender, getOperations } from './utils'

interface IProps {
  onCancel: () => void
}

const dataReleaseVersionSettingKey = 'DATA_RELEASE_VERSION_SETTING'

const VersionsModal = observer((props: IProps) => {
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
  >({})

  const columnsRender = getColumnsRender(filter, setFilter, [
    'alarm_status',
    'schedule_status',
    'version_id',
    'created_at',
  ])

  const handleMenuClick = () => {
    console.log('handleMenuClick')
  }

  const operations = getOperations(handleMenuClick)

  const { columns, setColumnSettings } = useColumns(
    dataReleaseVersionSettingKey,
    versionColumns,
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

  const data: Record<string, any> = {}
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
