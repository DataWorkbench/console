import { useRef } from 'react'
import { Form, RadioButton } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { styled, css } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import { assign } from 'lodash-es'
import { Modal, FlexBox, AffixLabel, TextLink } from 'components'

import { useStore, useMutationDataServiceCluster, getQueryKeyListDataServiceClusters } from 'hooks'

import { nameMatchRegex } from 'utils/convert'

const { TextField, RadioGroupField } = Form

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-body {
      ${tw`py-0`}
    }
  `
])

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-[686px] overflow-auto pt-[24px]`}
    form.is-horizon-layout {
      ${tw`pl-0`}
      > .field {
        > .label {
          ${tw`pr-2`}
        }
        > .control {
          &,
          & > input {
            ${tw`w-[416px] max-w-[416px]`}
          }
        }
        .select {
          ${tw`w-[416px] max-w-[416px]`}
        }
        > .help {
          ${tw`w-[420px] flex-wrap`}
        }
      }
    }
  `
])

const formStyle = {
  CURadioGroup: css`
    .radio-button {
      ${tw`w-[164px]! h-[125px]! mr-2 rounded-sm`}
      .radioBox {
        .title {
          ${tw`text-lg w-[164px] h-[53px]  text-neut-0 mb-0 text-left border-neut-13 border-b leading-[53px] mb-[8px]`}
        }
        div {
          ${tw`text-left pl-3 text-neut-8`}
        }
      }
    }
    .checked {
      .radioBox {
        .title {
          ${tw`bg-[rgba(21, 166, 117, 0.1)] border-b-0 rounded-sm`}
        }
        div {
          ${tw``}
        }
      }
    }
  `,
  validityRadioGroup: css`
    .radio-button {
      ${tw`w-[64px]! h-[32px]`}
    }
    .badgeText {
      ${tw`
            absolute top-[-10px] left-[-10px] w-[20px] text-neut-0 text-xs text-center bg-red-13 rounded-sm z-50
          `}
    }
  `,
  select: css`
    .control {
      ${tw`max-w-full!`}
    }
    .select {
      ${tw`w-[216px]!`}
    }
    ${tw`w-[216px]! mb-0 mb-[8px]!`}
  `
}

const defaultParams = {
  name: '',
  resource_spec: 1
}

const ClusterModal = observer(
  ({
    opWork,
    appendToBody = false
  }: {
    opWork?: typeof defaultParams & { id?: string }
    appendToBody?: boolean
  }) => {
    const {
      dtsStore: { setDataServiceOp, dataServiceOp }
    } = useStore()

    const [params, setParams] = useImmer(opWork || defaultParams)

    const formRef = useRef<Form>(null)
    const queryClient = useQueryClient()
    const mutation = useMutationDataServiceCluster()

    const handleOk = () => {
      const form = formRef.current
      if (form?.validateFields()) {
        const paramsData = assign(
          {
            op: dataServiceOp,
            name: params.name,
            resource_spec: params.resource_spec
          },
          opWork && { clusterId: opWork.id }
        )
        mutation.mutate(paramsData, {
          onSuccess: () => {
            setDataServiceOp('')
            queryClient.invalidateQueries(getQueryKeyListDataServiceClusters())
          }
        })
      }
    }

    return (
      <ModalWrapper
        title={`${dataServiceOp === 'create' ? '创建' : '修改'}服务集群`}
        confirmLoading={mutation.isLoading}
        visible
        onOk={handleOk}
        onCancel={() => setDataServiceOp('')}
        width={1000}
        height={800}
        draggable
        okText={dataServiceOp === 'create' ? '立即创建' : '确认'}
        appendToBody={appendToBody}
      >
        <FlexBox tw="h-full overflow-hidden">
          <FormWrapper>
            <Form ref={formRef}>
              <TextField
                autoComplete="off"
                label={<AffixLabel>名称</AffixLabel>}
                placeholder="请输入服务资源名称"
                name="name"
                validateOnBlur
                value={params.name}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.name = v
                  })
                }}
                schemas={[
                  {
                    rule: {
                      required: true,
                      matchRegex: nameMatchRegex,
                      maxLength: 128,
                      minLength: 2
                    },
                    status: 'error',
                    help: '不能为空，长度为 2～128 位。字母、数字或下划线（_）,不能以（_）开始结尾'
                  }
                ]}
              />
              <RadioGroupField
                name="schedulePolicy"
                label={<AffixLabel>CU 规格</AffixLabel>}
                value={params.resource_spec}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.resource_spec = Number(v)
                  })
                }}
                css={[formStyle.CURadioGroup]}
                schemas={[
                  {
                    rule: { required: true },
                    help: '请选择CU 规格',
                    status: 'error'
                  }
                ]}
                help={
                  <>
                    请参考
                    <TextLink href="/iaas/vpc/create" target="_blank" hasIcon>
                      服务集群性能指标
                    </TextLink>
                  </>
                }
              >
                <RadioButton size="" value={1}>
                  <div className="radioBox">
                    <div className="title">入门版</div>
                    <div className="maximumRequest">
                      最大每秒请求数：<span>500</span>
                    </div>
                    <div className="sla">
                      SLA: <span>99.5%</span>
                    </div>
                    <div className="maximumLink">
                      最大连接数：<span>500</span>
                    </div>
                  </div>
                </RadioButton>
                <RadioButton value={2}>
                  <div className="radioBox">
                    <div className="title">基础版</div>
                    <div className="maximumRequest">
                      最大每秒请求数：<span>1000</span>
                    </div>
                    <div className="sla">
                      SLA: <span>99.5%</span>
                    </div>
                    <div className="maximumLink">
                      最大连接数：<span>1000</span>
                    </div>
                  </div>
                </RadioButton>
                <RadioButton value={3}>
                  <div className="radioBox">
                    <div className="title">专业版</div>
                    <div className="maximumRequest">
                      最大每秒请求数：<span>2000</span>
                    </div>
                    <div className="sla">
                      SLA: <span>99.5%</span>
                    </div>
                    <div className="maximumLink">
                      最大连接数：<span>2000</span>
                    </div>
                  </div>
                </RadioButton>
              </RadioGroupField>
              {/* <RadioGroupField
                name="schedulePolicy"
                label={<AffixLabel>计费方式</AffixLabel>}
                value={params.optionValue === 1 ? 1 : 2}
                onChange={(v: number) => {
                  setParams((draft) => {
                    draft.optionValue = v
                  })
                }}
                schemas={[
                  {
                    rule: { required: true },
                    help: '请选择计费方式',
                    status: 'error'
                  }
                ]}
              >
                <Radio value={2}>包年包月</Radio>
                <Radio value={1}>按需(小时)</Radio>
              </RadioGroupField> */}
              {/* {params.optionValue === 2 && (
                <RadioGroupField
                  name="schedulePolicy"
                  label={<AffixLabel>购买有效期</AffixLabel>}
                  value={params.optionValue3}
                  onChange={(v: number) => {
                    setParams((draft) => {
                      draft.optionValue3 = v
                    })
                  }}
                  css={[formStyle.validityRadioGroup]}
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请选购买有效期',
                      status: 'error'
                    }
                  ]}
                >
                  {[1, 3, 6, 12, 24].map((item) => (
                    <Badge key={item} content={<span className="badgeText">惠</span>}>
                      <RadioButton key={item} value={item}>{`${item}月`}</RadioButton>
                    </Badge>
                  ))}
                </RadioGroupField>
              )} */}
              {/* {params.optionValue === 2 && (
                <Field>
                  <Label>自动续约</Label>
                  <div tw="w-[300px] relative">
                    <FlexBox css={[tw`w-full h-12  rounded-[2px] items-center `]}>
                      <Control>
                        <Checkbox
                          tw="text-white!"
                          onChange={(_: any, checked: boolean) => {
                            setParams((draft) => {
                              draft.optionValue2 = checked
                            })
                          }}
                        >
                          账户余额充足时,到期后自动续费
                        </Checkbox>
                      </Control>
                    </FlexBox>
                    {!!params.optionValue2 && (
                      <FlexBox css={[tw`w-full h-12  rounded-[2px] items-center absolute`]}>
                        <Select
                          onChange={(value: string) => {
                            setParams((draft) => {
                              draft.optionValue4 = value
                            })
                          }}
                          css={[formStyle.select]}
                          options={[
                            { value: '1', label: '1个月' },
                            { value: '3', label: '3个月' }
                          ]}
                          label={null}
                          optionRenderer={(option: { label: string; value: string }) => (
                            <FlexBox orient="row" tw="w-full">
                              <div tw="flex-auto">
                                <div>
                                  {option.label || option.value}
                                  <span tw="ml-2 inline-block bg-red-13 w-[36px] h-[18px] text-center rounded-sm">
                                    4.6折
                                  </span>
                                </div>
                              </div>
                              {params.optionValue4 === option.value && (
                                <Icon
                                  className="icon"
                                  name="check"
                                  type="coloured"
                                  color="#11865f"
                                  size={18}
                                />
                              )}
                            </FlexBox>
                          )}
                          placeholder="请选择续期时长"
                        />
                      </FlexBox>
                    )}
                  </div>
                </Field>
              )} */}
            </Form>
          </FormWrapper>
          {/* <div tw="w-80 pl-5 pt-5  border-neut-13 border-l">
            <div tw="text-base font-semibold mb-4">费用预览</div>
            <div>
              <RadioGroup
                value={params.optionValue}
                onChange={(v: number) => {
                  setParams((draft) => {
                    draft.optionValue = v
                  })
                }}
                tw="mb-[20px]"
              >
                <RadioButton value={2}>包年包月</RadioButton>
                <RadioButton value={1}>按需计费</RadioButton>
              </RadioGroup>
              <div tw="pb-2 border-b border-neut-13">
                收费标准详见
                <HelpCenterLink href="/billing/price/" isIframe={false}>
                  《大数据工作台计费说明》
                </HelpCenterLink>
              </div>
              <div tw="flex mt-3">
                <div tw="w-[80px] text-sm">总价</div>
                <div tw="flex-1">
                  <div tw="flex text-right justify-center justify-end">
                    <span tw="text-green-11 text-xl">1090.0000</span>
                    <span tw="text-neut-8 text-xs self-center ml-3"> ¥/1年</span>
                  </div>
                  <div tw="text-neut-8 text-right text-xs">(相比按需模式节省了：¥ 560.19 )</div>
                </div>
              </div>
              <div tw="mt-3 rounded bg-[rgba(255, 255, 255, 0.1)] text-neut-3 p-3 text-xs! leading-5">
                您有大数据工作台专属优惠券
                <RouterLink to="" color="red" tw="m-0.5">
                  ¥2000.21
                </RouterLink>
                可支持本次选购，支付后系统默认优先消费优惠券，且可分多次分拆使用（如选购金额如不满
                ¥2000.21，余额可持续使用）
              </div>
            </div>
          </div> */}
        </FlexBox>
      </ModalWrapper>
    )
  }
)

export default ClusterModal
