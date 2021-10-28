import { useMemo, useState } from 'react'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { Button, Icon, Form } from '@QCFE/qingcloud-portal-ui'
import { Collapse, Field, Label } from '@QCFE/lego-ui'
import { FlexBox, Center, Modal, ModalStep, ModalContent } from 'components'
import { useImmer } from 'use-immer'
import { useStore } from 'hooks'

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

const UdfModal = observer(() => {
  const {
    dmStore: { setUdfOp, udfType },
  } = useStore()
  const [step, setStep] = useState(0)
  const [params, setParams] = useImmer({
    type: 3,
  })

  const langData = useMemo(
    () => [
      { text: 'Java', icon: 'java', type: 3 },
      { text: 'Python', icon: 'python', type: 4 },
      { text: 'Scala', icon: 'coding', type: 5 },
    ],

    []
  )

  const curLangInfo = langData.find((item) => item.type === params.type)

  const handleOk = () => {
    if (step === 0) {
      setStep(1)
    }
  }

  const handleCancel = () => {
    setUdfOp('')
  }

  return (
    <Modal
      orient="fullright"
      width={800}
      title="新建函数节点"
      visible
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <div tw="flex justify-end space-x-2">
          {step === 0 ? (
            <Button onClick={handleCancel}>取消</Button>
          ) : (
            <Button onClick={() => setStep(0)}>上一步</Button>
          )}
          <Button type="primary" onClick={handleOk}>
            {step === 0 ? '下一步' : '确定'}
          </Button>
        </div>
      }
    >
      <>
        <ModalStep step={step} stepTexts={['选择语言', '填写信息']} />
        {step === 0 && (
          <ModalContent>
            <FlexBox tw="justify-between space-x-3">
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
                <Form layout="horizon">
                  <Field>
                    <Label>* 函数类型</Label>
                    <span>{udfType}</span>
                  </Field>
                  <Field>
                    <Label>* 语言类型</Label>
                    <span>{curLangInfo?.text}</span>
                  </Field>
                  <TextField name="name" label="* 函数名" />
                  <TextAreaField name="desc" label="描述" />
                  <TextAreaField name="example" label="示例" />
                </Form>
              </FormWrapper>
            </CollapseItem>
            <CollapseItem label="特有属性" key="p2">
              <FormWrapper>
                <Form layout="horizon">
                  {(() => {
                    if (curLangInfo) {
                      const { type, text } = curLangInfo
                      if (type === 3) {
                        return (
                          <SelectField
                            name="jars"
                            label={`引用${text}包`}
                            help="如需选择新的 Jar 包资源，可以在资源管理中上传资源"
                          />
                        )
                      }
                      return (
                        <TextAreaField name="statement" label={`${text}语句`} />
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
