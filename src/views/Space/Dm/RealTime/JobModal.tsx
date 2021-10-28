import { useRef, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { DarkModal, ModalStep, ModalContent } from 'components'
import { Icon, Form, Button } from '@QCFE/qingcloud-portal-ui'
import { get, assign } from 'lodash-es'
import tw from 'twin.macro'
import { useMutationStreamJob, getFlowKey } from 'hooks'
import { useQueryClient } from 'react-query'

const { TextField, TextAreaField, SelectField } = Form

const JobModal = ({ job, onCancel }: { job: any; onCancel: () => void }) => {
  const form = useRef<Form>(null)
  const [params, setParams] = useImmer({
    step: job ? 1 : 0,
    scheType: job ? job.type : 0,
  })
  const mutation = useMutationStreamJob()
  const queryClient = useQueryClient()

  const handleCancel = () => {
    setParams((draft) => {
      draft.step = 0
    })
    if (onCancel) {
      onCancel()
    }
  }

  const handleNext = () => {
    if (params.step === 0) {
      setParams((draft) => {
        draft.step = 1
      })
    } else if (form.current?.validateForm()) {
      const fields = form.current.getFieldsValue()
      mutation.mutate(
        assign(
          {
            op: job ? 'update' : 'create',
            type: params.scheType,
            ...fields,
          },
          job && { jobId: job.id }
        ),
        {
          onSuccess: () => {
            handleCancel()
            queryClient.invalidateQueries(getFlowKey())
          },
        }
      )
    }
  }

  const scheduleTypes = useMemo(
    () => [
      {
        type: 1,
        title: '节点编排',
        disp: '通过可视化节点编排完成 Flink 任务构建，适合有一定技术思想的业务人员进行数据开发。',
        icon: 'network-router',
      },
      {
        type: 2,
        title: 'SQL模式',
        disp: '原生 Flink SQL 支持，包含更多特性和功能，比算子编排更为强大。',
        icon: 'network-router',
      },
      {
        type: -1,
        subType: [3, 4, 5],
        title: '代码开发',
        subItems: [
          { type: 3, text: 'Jar', icon: 'java' },
          { type: 4, text: 'Python', icon: 'python' },
          { type: 5, text: 'Scala', icon: 'coding' },
        ],
        icon: 'network-router',
      },
    ],
    []
  )

  return (
    <DarkModal
      visible
      title="创建作业流程"
      placement="center"
      width={job ? '800px' : '70%'}
      onCancel={handleCancel}
      footer={
        <div tw="flex justify-end space-x-2">
          {params.step === 0 || job ? (
            <Button onClick={handleCancel}>取消</Button>
          ) : (
            <Button
              onClick={() =>
                setParams((draft) => {
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
            disabled={params.scheType === 0}
          >
            {params.step === 0 ? '下一步' : '确定'}
          </Button>
        </div>
      }
    >
      {!job && (
        <ModalStep
          step={params.step}
          sameLine
          stepTexts={['选择模式', '填写信息']}
          stepClassName={tw`w-80`}
        />
      )}
      <ModalContent>
        {params.step === 0 && (
          <div>
            <div tw="mb-4">请选择要进行编排的形式</div>
            <div tw="flex justify-between space-x-5 2xl:space-x-9 mb-5 2xl:mb-10">
              {scheduleTypes.map(
                ({ type, subType, title, disp, subItems, icon }) => (
                  <div
                    key={type}
                    css={[
                      tw`w-1/3 flex flex-col border-2 rounded overflow-hidden transition-colors`,
                      params.scheType === type ||
                      subType?.includes(params.scheType)
                        ? tw`border-green-11`
                        : tw`border-neut-13`,
                    ]}
                    onClick={() => {
                      if (type !== -1) {
                        setParams((draft) => {
                          draft.scheType = type
                        })
                      }
                    }}
                  >
                    <div tw="bg-neut-15 h-40 2xl:h-52 flex justify-center items-center">
                      <Icon name={icon} className="align-middle" size={50} />
                    </div>
                    <div tw="bg-neut-17 py-3 px-3 2xl:py-5 2xl:pl-5 text-base flex-1">
                      <div tw="font-semibold ">{title}</div>
                      <div tw="mt-2 text-neut-8 space-x-2">
                        {disp ||
                          subItems?.map((item) => (
                            <Button
                              key={item.type}
                              css={
                                params.scheType === item.type &&
                                tw`border-green-13! text-green-11! font-medium`
                              }
                              onClick={() => {
                                setParams((draft) => {
                                  draft.scheType = item.type
                                })
                              }}
                            >
                              <Icon name={item.icon} type="light" />
                              {item.text}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {params.step === 1 && (
          <div tw="flex justify-center mb-10">
            <Form layout="vertical" ref={form}>
              <TextField
                name="name"
                label="* 作业名称"
                placeholder='允许包含字母、数字 及 "_"，长度2～128'
                validateOnChange
                defaultValue={get(job, 'name', '')}
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
              {!job && (
                <SelectField
                  name="cluster_id"
                  label="计算集群"
                  placeholder="请选择计算集群"
                  value="eng-0000000000000000"
                  options={[
                    {
                      label: 'test',
                      value: 'eng-0000000000000000',
                    },
                  ]}
                />
              )}
              <TextAreaField
                name="desc"
                label="描述"
                defaultValue={get(job, 'desc', '')}
                placeholder="请输入作业描述"
                validateOnChange
                schemas={[
                  {
                    rule: { required: true },
                    help: '请输入作业描述',
                    status: 'error',
                  },
                ]}
              />
            </Form>
          </div>
        )}
      </ModalContent>
    </DarkModal>
  )
}

export default JobModal
