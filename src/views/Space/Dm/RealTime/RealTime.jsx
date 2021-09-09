import React, { useState, useRef } from 'react'
import { useToggle } from 'react-use'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Icon, Form } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import tw from 'twin.macro'
import FlowMenu from './FlowMenu'
import FlowTabs from './FlowTabs'

const { TextField, TextAreaField } = Form

const scheduleTypes = [
  {
    type: 3,
    title: '算子编排',
    disp: '这是一段关于算子编排很长很长很长很长很长很长很长的介绍',
    icon: 'network-router',
  },
  {
    type: 1,
    title: 'SQL 语句',
    disp: '这是一段关于SQL 语句很长很长很长很长很长很长很长的介绍',
    icon: 'binary',
  },
  {
    type: 2,
    title: '运行JAR 包',
    disp: '这是一段关于算子编排很长很长很长很长很长很长很长的介绍',
    icon: 'jar',
  },
]

function RealTime() {
  const form = useRef(null)
  const { regionId, spaceId } = useParams()
  const [showCreate, toggleCreate] = useToggle(false)
  const [step, setStep] = useState(0)
  const [scheType, setScheType] = useState()
  const {
    globalStore: { darkMode },
    workFlowStore,
    workFlowStore: { curFlow },
  } = useStore()

  const handleNext = () => {
    if (step === 0) {
      setStep(1)
    } else if (form.current.validateForm()) {
      const fields = form.current.getFieldsValue()
      workFlowStore.create({
        ...fields,
        regionId,
        spaceId,
        type: scheType,
      })
    }
  }
  const handleCancel = () => {
    toggleCreate(false)
    setStep(0)
    setScheType(null)
  }

  return (
    <div tw="tw-flex tw-min-h-[600px] tw-h-full tw-overflow-auto">
      <FlowMenu onCreateClick={() => toggleCreate(true)} />
      {curFlow ? (
        <FlowTabs />
      ) : (
        <div tw="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-text-neut-8">
          <div>
            <ul>
              <li>1. 新建业务流程</li>
              <li>2. 新建表</li>
              <li>3. 新建节点</li>
              <li>4. 编辑节点</li>
              <li>5. 测试运行并设置调度</li>
              <li>6. 提交、发布节点</li>
              <li>7. 生产环境查看任务</li>
            </ul>
          </div>
        </div>
      )}

      {showCreate && (
        <Modal
          show={showCreate}
          title="创建业务流程"
          placement="center"
          contentClassName={tw`tw-w-3/4 tw-mx-5 tw-rounded-md tw-shadow-xl`}
          onHide={handleCancel}
          onCancel={handleCancel}
          onOK={handleNext}
          darkMode={darkMode}
          okText={step === 0 ? '下一步' : '确定'}
        >
          <ModalStep
            step={step}
            sameLine
            stepTexts={['选择模式', '填写信息']}
            stepClassName={tw`tw-w-80`}
          />
          <ModalContent>
            {step === 0 && (
              <div>
                <div tw="tw-mb-4">请选择要进行编排的形式</div>
                <div tw="tw-flex tw-justify-between tw-space-x-9 tw-mb-10">
                  {scheduleTypes.map(({ type, title, disp, icon }) => (
                    <div
                      key={type}
                      css={[
                        tw`tw-w-1/3 tw-cursor-pointer tw-border tw-shadow`,
                        scheType === type
                          ? tw`tw-border-green-11`
                          : tw`tw-border-neut-17 hover:tw-border-green-11`,
                      ]}
                      onClick={() => setScheType(type)}
                    >
                      <div tw="tw-bg-neut-17 tw-h-60 tw-flex tw-justify-center tw-items-center">
                        <Icon
                          name={icon}
                          className="tw-align-middle"
                          size={50}
                        />
                      </div>
                      <div tw="tw-bg-neut-13 tw-py-5 tw-pl-6 tw-text-base">
                        <div tw="tw-font-semibold ">{title}</div>
                        <div tw="tw-mt-2 tw-text-neut-8">{disp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div tw="tw-flex tw-justify-center tw-mb-10">
                <Form layout="vertical" ref={form}>
                  <TextField
                    name="name"
                    label="* 业务名称"
                    placeholder='允许包含字母、数字 及 "_"，长度2～128'
                    labelClassName={tw`tw-text-white`}
                    controlClassName={tw`dark:tw-text-white tw-bg-neut-16 tw-border-neut-13 hover:tw-border-neut-8`}
                    validateOnChange
                    schemas={[
                      {
                        rule: { required: true },
                        help: '请输入名称',
                        status: 'error',
                      },
                      {
                        rule: { minLength: 2, maxLength: 128 },
                        help: '允许包含字母、数字 及 "_"，长度2～128',
                        status: 'error',
                      },
                    ]}
                  />
                  <TextAreaField
                    name="desc"
                    label="描述"
                    placeholder="请输入业务描述"
                    labelClassName={tw`tw-text-white`}
                    controlClassName={tw`dark:tw-text-white tw-bg-neut-16 tw-border-neut-13 hover:tw-border-neut-8`}
                    validateOnChange
                    schemas={[
                      {
                        rule: { required: true },
                        help: '请输入业务描述',
                        status: 'error',
                      },
                    ]}
                  />
                </Form>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

export default observer(RealTime)
