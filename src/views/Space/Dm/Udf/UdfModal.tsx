import { useMemo, useRef, useState } from 'react'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { Button, Icon, Form } from '@QCFE/qingcloud-portal-ui'
import { Collapse, Field, Label, PopConfirm } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'

import { FlexBox, Center, Modal, ModalStep, ModalContent } from 'components'
import { useMutationUdf, useStore } from 'hooks'
import { ILanguageInterface, UdfActionType, UdfTypes } from './interfaces'

const { TextField, TextAreaField, SelectField } = Form
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

const udfTypeBits = {
  UDF: /**  */ 0b0001,
  UDTF: /** */ 0b0010,
  UDTTF: /***/ 0b0100,
}

const filterLanguage = (language: ILanguageInterface, udfType: UdfTypes) => {
  // eslint-disable-next-line no-bitwise
  return udfTypeBits[udfType] & language.bit
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

const udfTypes = {
  UDF: 1,
  UDTF: 2,
  UDTTF: 3,
}

const UdfModal = observer(() => {
  const {
    dmStore: { op, setOp, udfType, modalData },
  } = useStore()

  const [step, setStep] = useState(op === 'create' ? 0 : 1)
  const [params, setParams] = useImmer({
    type: modalData?.udf_language || 3,
  })

  const formData = useRef<Record<string, any>>(modalData || {})
  const form = useRef()

  const [hasChange, setHasChange] = useState(false)
  const mutation = useMutationUdf()

  const langData = useMemo(
    () =>
      [
        { text: 'Java', icon: 'java', type: 3, bit: 0b0011 },
        { text: 'Python', icon: 'python', type: 4, bit: 0b0111 },
        { text: 'Scala', icon: 'coding', type: 5, bit: 0b111 },
      ].filter((lang) => filterLanguage(lang, udfType)),

    [udfType]
  )

  const curLangInfo = langData.find((item) => item.type === params.type)

  const handleOk = () => {
    if (step === 0) {
      setStep(1)
    } else if (form.current && (form.current as any).validateForm()) {
      const data = {
        ...formData.current,
        udf_language: params.type,
        udf_type: udfTypes[udfType],
      }
      mutation.mutate(
        { op, ...data },
        { onSuccess: () => console.log('成功了') }
      )
    }
  }

  const handleCancel = () => {
    setOp('')
  }

  const handleFormChange = (fieldValue: Record<string, any>) => {
    setHasChange(true)
    formData.current = {
      ...formData.current,
      ...fieldValue,
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
                content="若返回上一步，本次配置的信息将清空，确定返回上一步吗？"
                onOk={() => setStep(0)}
                closeAfterClick={false}
              >
                <Button>上一步</Button>
              </PopConfirm>
            ) : (
              <Button onClick={() => setStep(0)}>上一步</Button>
            )
          }
          <Button type="primary" onClick={handleOk}>
            {step === 0 ? '下一步' : '确定'}
          </Button>
        </div>
      )
    }
    if (_op === 'detail') {
      return (
        <div tw="">
          <PopConfirm
            className="popcanfirm-danger"
            type="warning"
            content="若修改函数名称或属性，相关工作流、任务会出现问题，确认编辑吗？"
            onOk={() => setOp('edit')}
            closeAfterClick={false}
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
          type="warning"
          content="更新内容会影响到相关工作流、任务，确认更新？"
          onOk={handleOk}
          closeAfterClick={false}
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
            tw="w-full border-l-0 border-r-0"
            defaultActiveKey={['p1', 'p2']}
          >
            <CollapseItem label="基础属性" key="p1">
              <FormWrapper>
                <Form
                  layout="horizon"
                  onFieldValueChange={handleFormChange}
                  form={form}
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
                    label="函数名"
                    help="hahaha"
                    disabled={op === 'detail'}
                    defaultValue={modalData?.name}
                  />
                  <TextAreaField
                    name="desc"
                    label="描述"
                    disabled={op === 'detail'}
                    defaultValue={modalData?.desc}
                  />
                  <TextAreaField
                    name="example"
                    label="示例"
                    disabled={op === 'detail'}
                    defaultValue={modalData?.example}
                  />
                </Form>
              </FormWrapper>
            </CollapseItem>
            <CollapseItem label="特有属性" key="p2">
              <FormWrapper>
                <Form layout="horizon" onFieldValueChange={handleFormChange}>
                  {(() => {
                    if (curLangInfo) {
                      const { type, text } = curLangInfo
                      if (type === 3) {
                        return (
                          <SelectField
                            name="jars"
                            label={`引用${text}包`}
                            help="如需选择新的 Jar 包资源，可以在资源管理中上传资源"
                            disabled={op === 'detail'}
                            defaultValue={modalData?.jars}
                          />
                        )
                      }
                      return (
                        <TextAreaField
                          name="statement"
                          label={`${text}语句`}
                          disabled={op === 'detail'}
                          defaultValue={modalData?.statment}
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
