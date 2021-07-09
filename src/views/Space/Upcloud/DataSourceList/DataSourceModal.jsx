import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import DbList from './DbList'
import ConfigForm from './ConfigForm'

const propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
}

const defaultProps = {
  onHide() {},
}

const stepTexts = ['选择数据库', '配置数据库']

const dbItems = [
  { name: 'hBase', disp: '这是一个很长很长很长很长的关于数据源的描述信息。' },
  {
    name: 'Postgresql',
    disp: '这是一个很长很长很长很长的关于数据源的描述信息。',
  },
  { name: 'Kafka', disp: '这是一个很长很长很长很长的关于数据源的描述信息。' },
  {
    name: '对象存储',
    disp: '这是一个很长很长很长很长的关于数据源的描述信息。',
  },
  { name: 'MySql', disp: '这是一个很长很长很长很长的关于数据源的描述信息。' },
  {
    name: 'Clickhouse',
    disp: '这是一个很长很长很长很长的关于数据源的描述信息。',
  },
]

function DataSourceModal({ show, onHide }) {
  const [step, setStep] = useState(0)
  const [dbIndex, setDbIndex] = useState()
  const handleStep = () => {
    if (step === 0) {
      setStep(1)
    }
  }
  const handleHide = () => {
    onHide()
  }
  const handleCancel = () => {
    if (step === 0) {
      onHide()
    } else {
      setStep(0)
    }
  }
  return (
    <Modal
      show={show}
      onHide={handleHide}
      title="新增数据源"
      okText={step === 0 ? '下一步' : '确定'}
      cancelText={step === 0 ? '取消' : '上一步'}
      onOK={handleStep}
      onCancel={handleCancel}
    >
      <ModalStep step={step} stepTexts={stepTexts} />
      <ModalContent>
        {step === 0 && (
          <>
            <p>
              请选择一个数据库，您也可以参考
              <a href="##" className="tw-text-link">
                数据库文档
              </a>
              进行查看配置
            </p>
            <DbList items={dbItems} onChange={(i) => setDbIndex(i)} />
          </>
        )}
        {step === 1 && <ConfigForm db={dbItems[dbIndex]} />}
      </ModalContent>
    </Modal>
  )
}

DataSourceModal.propTypes = propTypes
DataSourceModal.defaultProps = defaultProps

export default DataSourceModal
