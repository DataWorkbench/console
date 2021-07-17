import React, { useState } from 'react'
import { useToggle } from 'react-use'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import clsx from 'clsx'
import FlowMenu from './FlowMenu'

const scheduleTypes = [
  {
    name: 'opt_arrange',
    title: '算子编排',
    disp: '这是一段关于算子编排很长很长很长很长很长很长很长的介绍',
    icon: 'network-router',
  },
  {
    name: 'sql_statement',
    title: 'SQL 语句',
    disp: '这是一段关于算子编排很长很长很长很长很长很长很长的介绍',
    icon: 'binary',
  },
  {
    name: 'run_jar',
    title: '运行JAR 包',
    disp: '这是一段关于算子编排很长很长很长很长很长很长很长的介绍',
    icon: 'jar',
  },
]

function RealTimeComputing() {
  const [showCreate, toggleCreate] = useToggle(false)
  const [inputs, setInputs] = useState({
    bizName: '',
    bizDisp: '',
  })
  const [step, setStep] = useState(0)
  const [scheType, setScheType] = useState()
  const {
    globalStore: { darkMode },
  } = useStore()

  const handleNext = () => {
    if (step === 0) {
      setStep(1)
    } else {
      setStep(0)
      toggleCreate(false)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setInputs({ ...inputs, [name]: value })
  }

  return (
    <div className="tw-flex tw-h-full">
      <FlowMenu onCreateClick={() => toggleCreate(true)} />
      <div className="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-text-neutral-N8">
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
      {showCreate && (
        <Modal
          show={showCreate}
          title="创建业务流程"
          placement="center"
          dialogClassName=""
          contentClassName="tw-w-full tw-mx-5 tw-rounded-md tw-shadow-xl"
          onHide={() => toggleCreate(false)}
          onCancel={() => {
            toggleCreate(false)
            setStep(0)
          }}
          onOK={handleNext}
          darkMode={darkMode}
          okText={step === 0 ? '下一步' : '确定'}
        >
          <ModalStep
            step={step}
            sameLine
            stepTexts={['选择模式', '填写信息']}
            stepClassName="tw-w-80"
          />
          <ModalContent>
            {step === 0 && (
              <div>
                <div>请选择要进行编排的形式</div>
                <div className="tw-flex tw-justify-between tw-space-x-2 tw-mb-10">
                  {scheduleTypes.map(({ name, title, disp, icon }) => (
                    <div
                      key={name}
                      className={clsx(
                        'tw-w-1/3 tw-cursor-pointer tw-border  ',
                        scheType === name
                          ? 'tw-border-brand-G11'
                          : 'tw-border-neutral-N17 hover:tw-border-brand-G11'
                      )}
                      onClick={() => setScheType(name)}
                    >
                      <div className="tw-bg-neutral-N17 tw-h-60 tw-flex tw-justify-center tw-items-center">
                        <Icon
                          name={icon}
                          className="tw-align-middle"
                          size={50}
                        />
                      </div>
                      <div className="tw-bg-neutral-N13 tw-py-5 tw-pl-6 tw-text-base">
                        <div className="tw-font-semibold ">{title}</div>
                        <div className="tw-mt-2 tw-text-neutral-N8">{disp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="tw-flex tw-justify-center tw-mb-10">
                <form>
                  <label htmlFor="bizName" className="tw-block">
                    <span>* 业务名称</span>
                    <input
                      name="bizName"
                      type="text"
                      className={clsx(
                        'tw-block tw-bg-neutral-N16 tw-rounded-sm tw-pl-3 tw-py-1.5 tw-border tw-border-neutral-N13 tw-w-80',
                        'focus:tw-outline-none focus:tw-border-neutral-N8'
                      )}
                      placeholder='允许包含字母、数字 及 "_"，长度2～128'
                      value={inputs.bizName}
                      onChange={handleInputChange}
                    />
                  </label>
                  <lable htmlFor="bizDisp" className="tw-block tw-mt-3">
                    <span>描述</span>
                    <textarea
                      name="bizDisp"
                      rows="5"
                      placeholder="请输入业务描述"
                      className={clsx(
                        'tw-block tw-bg-neutral-N16 tw-rounded-sm tw-pl-3 tw-py-1.5 tw-border tw-border-neutral-N13 tw-w-[500px]',
                        'focus:tw-outline-none focus:tw-border-neutral-N8'
                      )}
                      value={inputs.bizDisp}
                      onChange={handleInputChange}
                    />
                  </lable>
                </form>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

RealTimeComputing.propTypes = {}

export default RealTimeComputing
