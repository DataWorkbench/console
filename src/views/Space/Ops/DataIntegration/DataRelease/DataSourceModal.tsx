import DataSourceForm from 'views/Space/Upcloud/DataSourceList/DataSourceForm'
import { Modal, ModalContent } from 'components'
import tw, { css, theme } from 'twin.macro'

import { sourceKinds } from 'views/Space/Upcloud/DataSourceList/constant'
import { useDescribeDataSource } from 'hooks'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import React from 'react'

const dataSourceStyle = css`
  & {
    .collapse .collapse-item-label > span.icon {
      transform: translateY(0);
    }
    .collapse-item > .collapse-item-label {
      ${tw`shadow-none!`}
    }
    .icon .qicon.qicon-container {
      fill: ${theme('colors.green.4')} !important;
      ${tw`text-green-11!`}
    }
  }
`

interface IDataSourceModalProps {
  datasourceId?: string
  datasourceType?: number
  onCancel: () => void
}
const DataSourceModal = (props: IDataSourceModalProps) => {
  const { datasourceId, datasourceType, onCancel } = props
  const op = 'view'
  const { data, isFetching } = useDescribeDataSource(datasourceId!)

  const opSourceList = data ? [data] : []
  const curkind = sourceKinds.find((i) => i.source_type === datasourceType)

  return (
    <Modal
      width={800}
      onCancel={onCancel}
      appendToBody
      footer={null}
      orient="fullright"
      visible
      title="数据源详情"
    >
      <ModalContent>
        <div tw="relative min-h-[400px]">
          {isFetching ? (
            <div tw="absolute inset-0 z-50">
              <Loading size="large" />
            </div>
          ) : (
            <DataSourceForm
              css={dataSourceStyle}
              op={op}
              opSourceList={opSourceList}
              resInfo={curkind as any}
              theme="dark"
            />
          )}
        </div>
      </ModalContent>
    </Modal>
  )
}
export default DataSourceModal
