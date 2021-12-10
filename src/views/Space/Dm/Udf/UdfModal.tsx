import { useMemo, useRef, useState } from 'react'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { Button, Icon, Form } from '@QCFE/qingcloud-portal-ui'
import { Collapse, Field, Label } from '@QCFE/lego-ui'
import { flatten, isEqualWith, pickBy, identity } from 'lodash-es'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import { toJS } from 'mobx'

import {
  FlexBox,
  Center,
  Modal,
  ModalStep,
  ModalContent,
  AffixLabel,
  PopConfirm,
  SelectWithRefresh,
  ActionLink,
} from 'components'
import {
  getResourceKey,
  getUdfKey,
  useMutationUdf,
  useQueryResource,
  useStore,
} from 'hooks'
import { ILanguageInterface, UdfActionType, UdfTypes } from './interfaces'
import { javaType, languageData, udfHasLangBits, udfTypes } from './constants'

const { TextField, TextAreaField } = Form
const { CollapseItem } = Collapse

const LangItem = styled('div')(({ selected }: { selected?: boolean }) => [
  tw`w-1/3 border rounded overflow-hidden border-neut-13 cursor-pointer transition-colors`,
  selected &&
    css`
      ${tw`border-green-13`}
      svg {
        ${tw`text-green-13`}
      }
    `,
  css`
    &:hover {
      ${tw`border-green-13`}
      svg {
        ${tw`text-green-13`}
      }
    }
  `,
])

const FormWrapper = styled('div')(() => [
  css`
    form.is-horizon-layout {
      ${tw`pl-0`}
      > .field {
        > .control {
          ${tw`max-w-full`}
          .textarea {
            ${tw`w-full`}
          }
        }
      }
    }
  `,
])

const filterLanguage = (language: ILanguageInterface, udfType: UdfTypes) => {
  // eslint-disable-next-line no-bitwise
  return udfHasLangBits[udfType] & language.bit
}

const getModalTitle = (op: UdfActionType, data?: Record<string, any>) => {
  switch (op) {
    case 'detail':
      return `函数节点：${data?.name} 详情`
    case 'edit':
      return `编辑函数节点：${data?.name} 详情`
    default:
      return '新建函数节点'
  }
}

const UdfModal = observer(() => {
  const {
    dmStore: { op, setOp, udfType, modalData },
  } = useStore()

  const [step, setStep] = useState(op === 'create' ? 0 : 1)
  const [params, setParams] = useImmer({
    type: modalData?.udf_language || javaType,
  })

  const formData = useRef<Record<string, any>>(modalData || {})
  const form = useRef()
  const form2 = useRef()

  const [hasChange, setHasChange] = useState(false)

  const [filter] = useImmer<{
    limit: number
    offset: number
    // udf_type: number
    resource_type: number
  }>({
    limit: 15,
    offset: 0,
    resource_type: 1, //
    // udf_type: 1,
  })

  const mutation = useMutationUdf()
  const queryClient = useQueryClient()

  const { status, data, fetchNextPage, hasNextPage } = useQueryResource(
    filter,
    {
      enabled: params.type === 2,
    }
  )
  const options = flatten(
    data?.pages.map((page: Record<string, any>) => page.infos || [])
  )

  const loadData = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const langData = useMemo(
    () => languageData.filter((lang) => filterLanguage(lang, udfType)),
    [udfType]
  )

  const curLangInfo = langData.find((item) => item.type === params.type)

  const refetchUdf = () => {
    queryClient.invalidateQueries(getUdfKey())
  }

  const refetchResource = () => {
    queryClient.invalidateQueries(getResourceKey('infinite'))
  }

  const handleCancel = () => {
    setOp('')
  }

  const handleOk = () => {
    if (step === 0) {
      setStep(1)
    } else if (
      form.current &&
      (form.current as any).validateForm() &&
      form2.current &&
      (form2.current as any).validateForm()
    ) {
      mutation.mutate(
        {
          op,
          ...formData.current,
          udf_language: params.type,
          udf_type: udfTypes[udfType],
        },
        {
          onSuccess: () => {
            handleCancel()
            refetchUdf()
          },
        }
      )
    }
  }

  const handleFormChange = (fieldValue: Record<string, any>) => {
    formData.current = {
      ...formData.current,
      ...fieldValue,
    }

    if (!isEqualWith(pickBy(formData.current, identity), toJS(modalData))) {
      setHasChange(true)
    } else {
      setHasChange(false)
    }
  }

  const getFooter = (_op: UdfActionType, _step: 0 | 1) => {
    if (_op === 'create') {
      return (
        <div tw="flex justify-end space-x-2">
          {
            // eslint-disable-next-line no-nested-ternary
            _step === 0 ? (
              <Button onClick={handleCancel}>取消</Button>
            ) : hasChange ? (
              <PopConfirm
                type="warning"
                content={
                  <div>
                    若返回上一步，本次配置的信息将清空，确定返回上一步吗？
                  </div>
                }
                onOk={() => {
                  setStep(0)
                  formData.current = {}
                  setHasChange(false)
                }}
              >
                <Button>上一步</Button>
              </PopConfirm>
            ) : (
              <Button onClick={() => setStep(0)}>上一步</Button>
            )
          }
          <Button
            type="primary"
            onClick={handleOk}
            loading={mutation.isLoading}
          >
            {step === 0 ? '下一步' : '确定新建'}
          </Button>
        </div>
      )
    }
    if (_op === 'detail') {
      return (
        <div tw="">
          <PopConfirm
            type="warning"
            placement="topRight"
            okType="danger"
            closeAfterClick={false}
            content={
              <div>
                若修改函数名称或属性，相关工作流、任务会出现问题，确认编辑吗？
              </div>
            }
            onOk={() => setOp('edit')}
            okText="编辑"
          >
            <Button type="danger">编辑</Button>
          </PopConfirm>
        </div>
      )
    }
    return (
      <div tw="flex justify-end space-x-2">
        <Button onClick={handleCancel}>取消</Button>
        <PopConfirm
          className="popcanfirm-danger"
          placement="topRight"
          type="warning"
          content={<div>更新内容会影响到相关工作流、任务，确认更新？</div>}
          onOk={handleOk}
        >
          <Button type="primary">确定</Button>
        </PopConfirm>
      </div>
    )
  }

  return (
    <Modal
      orient="fullright"
      width={800}
      title={getModalTitle(op as UdfActionType, modalData)}
      visible
      onOk={handleOk}
      onCancel={handleCancel}
      footer={getFooter(op as UdfActionType, step as 0)}
    >
      <>
        {op === 'create' && (
          <ModalStep step={step} stepTexts={['选择语言', '填写信息']} />
        )}
        {step === 0 && (
          <ModalContent>
            <FlexBox tw="justify-around space-x-3">
              {langData.map(({ type, icon, text }) => (
                <LangItem
                  key={type}
                  selected={type === params.type}
                  onClick={() => {
                    setParams((draft) => {
                      draft.type = type
                    })
                  }}
                >
                  <Center tw="h-28">
                    <Icon name={icon} size={48} type="light" />
                  </Center>
                  <div tw="py-4 pl-3 bg-neut-17">{text}</div>
                </LangItem>
              ))}
            </FlexBox>
          </ModalContent>
        )}
        {step === 1 && (
          <Collapse
            tw="w-full border-l-0 border-r-0 border-t-neut-13 border-t!"
            defaultActiveKey={['p1', 'p2']}
          >
            <CollapseItem
              label={
                <div tw="inline-flex items-center">
                  <Icon style={{ position: 'unset' }} tw="mr-2" name="record" />
                  基础属性
                </div>
              }
              key="p1"
            >
              <FormWrapper>
                <Form
                  layout="horizon"
                  onFieldValueChange={handleFormChange}
                  ref={form}
                >
                  <Field>
                    <Label tw="label-required">函数类型</Label>
                    <span>{udfType}</span>
                  </Field>
                  <Field>
                    <Label tw="label-required">语言类型</Label>
                    <span>{curLangInfo?.text}</span>
                  </Field>
                  <TextField
                    name="name"
                    labelClassName="label-required"
                    label={
                      curLangInfo?.type === javaType ? (
                        '函数名'
                      ) : (
                        <AffixLabel
                          required={false}
                          help="函数名需与实现名保持一致"
                          theme="green"
                        >
                          函数名
                        </AffixLabel>
                      )
                    }
                    disabled={op === 'detail'}
                    validateOnBlur
                    defaultValue={modalData?.name}
                    schemas={[
                      {
                        rule: {
                          required: true,
                          matchRegex: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
                        },
                        status: 'error',
                        help: '不能为空，字母、数字或下划线（_），不能以（_）开始结尾',
                      },
                    ]}
                  />
                  <TextAreaField
                    name="comment"
                    label="描述"
                    disabled={op === 'detail'}
                    defaultValue={modalData?.comment}
                  />
                  <TextAreaField
                    name="usage_sample"
                    label="示例"
                    disabled={op === 'detail'}
                    defaultValue={modalData?.usage_sample}
                  />
                </Form>
              </FormWrapper>
            </CollapseItem>
            <CollapseItem
              label={
                <div tw="inline-flex items-center">
                  <Icon style={{ position: 'unset' }} tw="mr-2" name="record" />
                  特有属性
                </div>
              }
              key="p2"
            >
              <FormWrapper>
                <Form
                  layout="horizon"
                  ref={form2}
                  onFieldValueChange={handleFormChange}
                >
                  {(() => {
                    if (curLangInfo) {
                      const { type, text } = curLangInfo
                      if (type === javaType) {
                        return (
                          <SelectWithRefresh
                            onRefresh={() => refetchResource()}
                            name="define"
                            label={`引用${text}包`}
                            labelClassName="label-required"
                            options={options}
                            isLoading={status === 'loading'}
                            isLoadingAtBottom
                            labelKey="name"
                            onMenuScrollToBottom={loadData}
                            bottomTextVisible
                            validateOnBlur
                            valueKey="id"
                            clearable
                            schemas={[
                              {
                                rule: { required: true },
                                help: (
                                  <div>
                                    请选择 Jar，如需选择新的 Jar
                                    包资源，可以在资源管理中
                                    <ActionLink
                                      href="./resource"
                                      target="_blank"
                                      // className="text-action"
                                      // tw="text-green-11"
                                    >
                                      上传资源
                                      <Icon name="if-external-link" />
                                    </ActionLink>
                                  </div>
                                ),
                                status: 'error',
                              },
                            ]}
                            help={
                              <div>
                                如需选择新的 Jar 包资源，可以在资源管理中
                                <ActionLink
                                  href="./resource"
                                  target="_blank"
                                  // className="text-action"
                                  // tw="text-green-11"
                                >
                                  上传资源
                                </ActionLink>
                              </div>
                            }
                            disabled={op === 'detail'}
                            defaultValue={modalData?.define}
                          />
                        )
                      }
                      return (
                        <TextAreaField
                          name="define"
                          label={`${text}语句`}
                          labelClassName="label-required"
                          disabled={op === 'detail'}
                          defaultValue={modalData?.define}
                          validateOnBlur
                          schemas={[
                            {
                              rule: { required: true },
                              help: `请输入${text}语句`,
                              status: 'error',
                            },
                          ]}
                        />
                      )
                    }
                    return null
                  })()}
                </Form>
              </FormWrapper>
            </CollapseItem>
          </Collapse>
        )}
      </>
    </Modal>
  )
})

export default UdfModal
