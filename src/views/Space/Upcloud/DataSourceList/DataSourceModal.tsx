import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
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

function DataSourceModal({ show, onHide }) {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const [kinds, setKinds] = useState([])
  const [step, setStep] = useState(0)
  const [dbIndex, setDbIndex] = useState()
  const [loading, toggleLoading] = useToggle(true)
  const form = useRef()
  const { dataSourceStore } = useStore()

  useMount(() => {
    dataSourceStore
      .loadEngineMap({ regionId, spaceId })
      .then((items) => {
        setKinds(items)
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
        <div className="flex justify-end">
          {step === 0 ? (
            <Button>取消</Button>
          ) : (
            <>
              <Button className="mr-2" onClick={() => setStep(0)}>
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
              <a href="##" className="text-link">
                数据库文档
              </a>
              进行查看配置
            </p>
            <DbList items={kinds} onChange={handleDbSelect} />
          </Loading>
        )}
        {step === 1 && <ConfigForm ref={form} db={kinds[dbIndex]} />}
      </ModalContent>
    </Modal>
  )
}

DataSourceModal.propTypes = propTypes
DataSourceModal.defaultProps = defaultProps

export default DataSourceModal
