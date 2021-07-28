import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useMount, useToggle } from 'react-use'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
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

// const dbItems = [
//   { name: 'MySql', disp: '这是一个很长很长很长很长的关于数据源的描述信息。' },
//   {
//     name: 'PostgreSQL',
//     disp: '这是一个很长很长很长很长的关于数据源的描述信息。',
//   },
//   { name: 'Kafka', disp: '这是一个很长很长很长很长的关于数据源的描述信息。' },
//   { name: 'S3', disp: '这是一个很长很长很长很长的关于数据源的描述信息。' },
//   {
//     name: 'ClickHouse',
//     disp: '这是一个很长很长很长很长的关于数据源的描述信息。',
//   },
//   {
//     name: 'Hbase',
//     disp: '这是一个很长很长很长很长的关于数据源的描述信息。',
//   },
// ]

function DataSourceModal({ show, onHide }) {
  const [dbItems, setDbItems] = useState([])
  const [step, setStep] = useState(0)
  const [dbIndex, setDbIndex] = useState()
  const [loading, toggleLoading] = useToggle(true)
  const form = useRef()
  const { dataSourceStore } = useStore()

  useMount(() => {
    dataSourceStore
      .loadEngineMap()
      .then((dbl) => {
        setDbItems(dbl)
        // console.log(engines)
      })
      .catch(() => {
        // console.warn(e.message)
      })
      .then(() => {
        toggleLoading(false)
      })
  })

  const handleHide = () => {
    onHide()
  }
  const handleDbSelect = (i) => {
    setDbIndex(i)
    setStep(1)
  }
  const handleSave = () => {
    if (form.current.validateForm()) {
      // const params = form.current.getFieldsValue()
    }
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
          <Loading spinning={loading} delay={200}>
            <p>
              请选择一个数据库，您也可以参考
              <a href="##" className="tw-text-link">
                数据库文档
              </a>
              进行查看配置
            </p>
            <DbList items={dbItems} onChange={handleDbSelect} />
          </Loading>
        )}
        {step === 1 && <ConfigForm ref={form} db={dbItems[dbIndex]} />}
      </ModalContent>
    </Modal>
  )
}

DataSourceModal.propTypes = propTypes
DataSourceModal.defaultProps = defaultProps

export default DataSourceModal
