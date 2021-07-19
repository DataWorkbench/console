import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Button } from '@QCFE/qingcloud-portal-ui'
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
  const form = useRef()
  const handleHide = () => {
    onHide()
  }
  const handleDbSelect = (i) => {
    setDbIndex(i)
    setStep(1)
  }
  const handleSave = () => {
    // console.log(form.current.getFieldsValue())
  }
  return (
    <Modal
      show={show}
      onHide={handleHide}
      title="新增数据源"
      footer={
        <div className="tw-flex tw-justify-end">
          {step === 0 ? (
            <Button>取消</Button>
          ) : (
            <>
              <Button className="tw-mr-2" onClick={() => setStep(0)}>
                上一步
              </Button>
              <Button type="primary" onClick={handleSave}>
                确定
              </Button>
            </>
          )}
        </div>
      }
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
            <DbList items={dbItems} onChange={handleDbSelect} />
          </>
        )}
        {step === 1 && <ConfigForm ref={form} db={dbItems[dbIndex]} />}
      </ModalContent>
    </Modal>
  )
}

DataSourceModal.propTypes = propTypes
DataSourceModal.defaultProps = defaultProps

export default DataSourceModal
