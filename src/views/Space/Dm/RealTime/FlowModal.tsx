import { useRef } from 'react'
import { useImmer } from 'use-immer'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Icon, Form, Button } from '@QCFE/qingcloud-portal-ui'
import tw from 'twin.macro'
import { useStore } from 'stores'
import { useMutationFlow, getFlowKey } from 'hooks'
import { useQueryClient } from 'react-query'

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

const FlowModal = observer(() => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const form = useRef<Form>(null)
  const [state, setState] = useImmer({
    step: 0,
    scheType: 0,
  })
  const {
    workFlowStore,
    workFlowStore: { showFlowModal },
  } = useStore()
  const mutation = useMutationFlow()
  const queryClient = useQueryClient()

  const handleCancel = () => {
    setState((draft) => {
      draft.step = 0
    })
    workFlowStore.set({ showFlowModal: false })
  }

  const handleNext = () => {
    if (state.step === 0) {
      setState((draft) => {
        draft.step = 1
      })
    } else if (form.current?.validateForm()) {
      const fields = form.current.getFieldsValue()
      mutation.mutate(
        {
          regionId,
          spaceId,
          type: state.scheType,
          ...fields,
        },
        {
          onSuccess: () => {
            handleCancel()
            queryClient.invalidateQueries(getFlowKey())
          },
        }
      )
    }
  }

  return (
    <Modal
      show={showFlowModal}
      title="创建业务流程"
      placement="center"
      contentClassName={tw`w-3/5 overflow-auto mx-5 rounded-md shadow-xl`}
      onHide={handleCancel}
      footer={
        <div tw="flex justify-end space-x-2">
          {state.step === 0 ? (
            <Button onClick={handleCancel}>取消</Button>
          ) : (
            <Button
              onClick={() =>
                setState((draft) => {
                  draft.step = 0
                })
              }
            >
              上一步
            </Button>
          )}
          <Button
            type="primary"
            loading={mutation.isLoading}
            onClick={handleNext}
          >
            确定
          </Button>
        </div>
      }
      // cancelText={state.step === 1 ? '上一步' : '取消'}
      // okText={state.step === 0 ? '下一步' : '确定'}
    >
      <ModalStep
        step={state.step}
        sameLine
        stepTexts={['选择模式', '填写信息']}
        stepClassName={tw`w-80`}
      />
      <ModalContent>
        {state.step === 0 && (
          <div>
            <div tw="mb-4">请选择要进行编排的形式</div>
            <div tw="flex justify-between space-x-5 2xl:space-x-9 mb-5 2xl:mb-10">
              {scheduleTypes.map(({ type, title, disp, icon }) => (
                <div
                  key={type}
                  css={[
                    tw`w-1/3 cursor-pointer border shadow transition-colors`,
                    state.scheType === type
                      ? tw`border-green-11`
                      : tw`border-neut-17 hover:border-green-11`,
                  ]}
                  onClick={() =>
                    setState((draft) => {
                      draft.scheType = type
                    })
                  }
                >
                  <div tw="bg-neut-17 h-40 2xl:h-60 flex justify-center items-center">
                    <Icon name={icon} className="align-middle" size={50} />
                  </div>
                  <div tw="bg-neut-13 py-3 pl-3 2xl:py-5 2xl:pl-6 text-base">
                    <div tw="font-semibold ">{title}</div>
                    <div tw="mt-2 text-neut-8">{disp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {state.step === 1 && (
          <div tw="flex justify-center mb-10">
            <Form layout="vertical" ref={form}>
              <TextField
                name="name"
                label="* 业务名称"
                placeholder='允许包含字母、数字 及 "_"，长度2～128'
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
  )
})

export default FlowModal
