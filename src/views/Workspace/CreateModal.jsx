import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { RadioButton } from '@QCFE/lego-ui'
import { Form, Button } from '@QCFE/qingcloud-portal-ui'
import Modal from 'components/Modal'

const { TextField, RadioGroupField, TextAreaField } = Form

function CreateModal({ onHide }) {
  const [step, setStep] = useState(0)
  const [show, setShow] = useState(true)

  return (
    <Modal
      show={show}
      title="创建工作空间"
      closable
      placement="rightFull"
      onOK={() => {
        setStep(step === 0 ? 1 : 0)
      }}
      onHide={() => {
        setShow(false)
        onHide()
      }}
      okText="下一步"
      footer={
        step === 1 && (
          <div className="tw-flex tw-justify-between">
            <div>
              <Button onClick={() => setStep(0)}>上一步</Button>
            </div>
            <div className="tw-inline-flex">
              <Button type="black" className="tw-mr-2">
                跳过
              </Button>
              <Button type="primary">确定创建</Button>
            </div>
          </div>
        )
      }
    >
      <div
        className={clsx(
          `tw-flex tw-h-20 tw-items-center tw-px-8 tw-bg-neutral-N1`
        )}
      >
        <div className="tw-text-center">
          <span
            className={clsx(
              'tw-inline-block tw-w-7 tw-h-7 tw-rounded-full ',
              step === 0
                ? 'tw-bg-brand-G11 tw-text-white tw-leading-7'
                : 'tw-border-2 tw-border-neutral-N3 tw-leading-6'
            )}
          >
            1
          </span>
          <div className="tw-font-medium tw-mt-1">填写工作空间信息</div>
        </div>
        <div className="tw-flex-1 ">
          <div className="tw-border-t-2 tw-border-neutral-N3 tw-h-6">
            &nbsp;
          </div>
        </div>
        <div className="tw-text-center">
          <div
            className={clsx(
              'tw-inline-block tw-w-7 tw-h-7 tw-rounded-full',
              step === 1
                ? 'tw-bg-brand-G11 tw-text-white tw-leading-7'
                : 'tw-border-2 tw-border-neutral-N3 tw-leading-6'
            )}
          >
            2
          </div>
          <div className="tw-font-medium tw-mt-1">绑定引擎(选填)</div>
        </div>
      </div>
      <div className="tw-pt-8 tw-pl-5">
        <div className={clsx({ 'tw-hidden': step !== 0 })}>
          <Form layout="vertical" style={{ maxWidth: '450px' }}>
            <RadioGroupField name="region" label="区域" defaultValue="pek3">
              <RadioButton value="pek3">pek3</RadioButton>
            </RadioGroupField>
            <TextField
              name="name"
              label="工作空间名称"
              placeholder="中文、字母、数字或下划线（_）"
              labelClassName="medium"
            />
            <TextAreaField
              name="comment-2"
              label="工作空间描述"
              placeholder="请填写工作空间的描述"
              rows="5"
            />
          </Form>
        </div>
        <div className={clsx({ 'tw-hidden': step !== 1 })}>
          <Form layout="vertical" style={{ maxWidth: '450px' }}>
            <RadioGroupField name="region" label="引擎类型" defaultValue="pek3">
              <RadioButton value="pek3"> 实时计算 Flink</RadioButton>
            </RadioGroupField>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

CreateModal.propTypes = {
  onHide: PropTypes.func,
}

CreateModal.defaultProps = {
  onHide() {},
}

export default CreateModal
