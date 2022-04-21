import React from 'react'
import DataSourceForm from 'views/Space/Upcloud/DataSourceList/DataSourceForm'
import { Modal, ModalContent } from 'components'
import tw, { css, theme } from 'twin.macro'

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

interface IProps {
  onCancel: () => void
}

const DataSourceModal = (props: IProps) => {
  const { onCancel } = props
  const op = 'view'
  const opSourceList = [{}]
  const curkind = {
    name: 'Mysql',
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
        <DataSourceForm
          css={dataSourceStyle}
          op={op}
          opSourceList={opSourceList}
          resInfo={curkind}
          theme="dark"
        />
      </ModalContent>
    </Modal>
  )
}

export default DataSourceModal
