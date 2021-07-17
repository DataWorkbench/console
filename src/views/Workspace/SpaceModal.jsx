import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { observer } from 'mobx-react'
import { RadioButton } from '@QCFE/lego-ui'
import { Form, Message } from '@QCFE/qingcloud-portal-ui'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { useStore } from 'stores'

const { TextField, RadioGroupField, TextAreaField } = Form

const propTypes = {
  onHide: PropTypes.func,
  zone: PropTypes.string,
}

const defaultProps = {
  onHide() {},
}

function SpaceModal({ zone, onHide }) {
  const [step, setStep] = useState(0)
  const form = useRef(null)
  const { workspaceStore } = useStore()
  const { loadStatus, curOpt, curSpace } = workspaceStore
  const handleOk = () => {
    if (step === 0) {
      setStep(1)
    } else {
      const fields = form.current.getFieldsValue()
      let promise = null
      if (curOpt === 'create') {
        promise = workspaceStore.create({ ...fields, zone })
      } else {
        promise = workspaceStore.update({ ...fields, zone, id: curSpace.id })
      }
      promise.then(
        () => {
          onHide()
          workspaceStore.load()
        },
        (err) => {
          Message.open({
            content: err.message,
            type: 'error',
            placement: 'bottomRight',
          })
        }
      )
    }
  }

  const handleCancel = () => {
    if (step === 1) {
      setStep(0)
    } else {
      onHide()
    }
  }

  return (
    <Modal
      title={`${curOpt === 'create' ? '创建' : '修改'}工作空间`}
      closable
      show
      placement="rightFull"
      onOK={handleOk}
      onHide={onHide}
      onCancel={handleCancel}
      showConfirmLoading={loadStatus?.state === 'pending'}
      okText={step === 0 ? '下一步' : '确定创建'}
      cancelText={step === 0 ? '取消' : '上一步'}
    >
      <ModalStep
        step={step}
        stepTexts={['填写工作空间信息', '绑定引擎(选填)']}
      />
      <ModalContent>
        <div className={clsx({ 'tw-hidden': step !== 0 })}>
          <Form ref={form} layout="vertical" style={{ maxWidth: '450px' }}>
            <RadioGroupField name="zone" label="区域" defaultValue={zone}>
              <RadioButton value={zone}>{zone}</RadioButton>
            </RadioGroupField>
            <TextField
              name="name"
              label="工作空间名称"
              placeholder="中文、字母、数字或下划线（_）"
              labelClassName="medium"
              defaultValue={curOpt === 'create' ? '' : curSpace.name}
            />
            <TextAreaField
              name="desc"
              label="工作空间描述"
              placeholder="请填写工作空间的描述"
              rows="5"
              defaultValue={curOpt === 'create' ? '' : curSpace.desc}
            />
          </Form>
        </div>
        <div className={clsx({ 'tw-hidden': step !== 1 })}>
          <RadioGroupField name="region" label="引擎类型" defaultValue="pek3">
            <RadioButton value="pek3"> 实时计算 Flink</RadioButton>
          </RadioGroupField>
        </div>
      </ModalContent>
    </Modal>
  )
}

SpaceModal.propTypes = propTypes
SpaceModal.defaultProps = defaultProps

export default observer(SpaceModal)
