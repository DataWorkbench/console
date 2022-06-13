import { useRef } from 'react'
import { useImmer } from 'use-immer'
import { AffixLabel, DarkModal, ModalContent } from 'components'
import { get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import { strlen } from 'utils'
import { Checkbox, Control, Field, Form, Label, Radio, Input, Button, Toggle } from '@QCFE/lego-ui'
import { HelpCenterLink } from 'components/Link'

const { TextField, RadioGroupField, TextAreaField } = Form

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-full`}
    .form {
      ${tw`pl-0`}
      &.is-horizon-layout>.field {
        > .label {
          ${tw`w-28`}
        }
        > .control {
          ${tw`flex-1 max-w-[556px]`}
          .select {
            ${tw`w-full`}
          }
          .textarea {
            ${tw`w-[556px] max-w-[556px]`}
          }
        }
        > .help {
          ${tw`w-full  ml-28`}
        }
      }
    }
  `
])
export interface JobModalData {
  id: string
  pid: string
  type: number
  isEdit: boolean
  pNode?: Record<string, any>
}

export const JobModal = observer(() => {
  const form = useRef<Form>(null)
  const [params, setParams] = useImmer(() => ({
    apiMode: '',
    apiGroupName: '',
    apiName: '',
    apiPath: '/',
    apiAgreement: '',
    isCross: false,
    methods: '',
    responseType: 'json',
    Desc: ''
  }))

  const { dtsDevStore } = useStore()

  const onClose = () => {
    dtsDevStore.set({ showBaseSetting: false })
  }

  const handleOK = () => {
    if (form.current?.validateForm()) {
      console.log(params)
      onClose()
    }
  }

  return (
    <DarkModal
      orient="fullright"
      visible
      title="属性"
      width={900}
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleOK}>
            保存
          </Button>
        </div>
      }
    >
      <ModalContent>
        <FormWrapper>
          <Form layout="horizon" ref={form}>
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>API 服务组</AffixLabel>
              </Label>
              <Control tw="items-center">API 组 01</Control>
            </Field>
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>API ID</AffixLabel>
              </Label>
              <Control tw="items-center">yrl0o4601938kr9y</Control>
            </Field>
            <TextField
              name="apiName"
              label={<AffixLabel>API名称</AffixLabel>}
              value={get(params, 'apiName', '')}
              onChange={(v: string | number) =>
                setParams((draft) => {
                  draft.apiName = String(v)
                })
              }
              validateOnChange
              placeholder="请输入API组名称"
              maxLength={50}
              schemas={[
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l >= 4 && l <= 50
                  },
                  help: '请输入4~50 个字符，支持汉字、英文字母、数字、英文格式的下划线',
                  status: 'error'
                }
              ]}
              help={
                <>
                  必须唯一，支持汉字、英文字母、数字、英文格式的下划线，必须以英文字母或汉字开头，4~50
                  个字符
                </>
              }
            />
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>API路径</AffixLabel>
              </Label>
              <Control tw="items-center">
                <Input
                  name="apiGroupName"
                  value={get(params, 'apiGroupName', '')}
                  disabled
                  tw="w-[150px]! block! items-center! space-x-1 mr-2"
                />
                <Input
                  name="apiPath"
                  value={get(params, 'apiPath', '')}
                  onChange={(_, v: string | number) =>
                    setParams((draft) => {
                      draft.apiPath = String(v)
                    })
                  }
                  validateOnChange
                  placeholder="请输入API路径"
                  maxLength={50}
                  schemas={[
                    {
                      rule: (value: string) => {
                        const l = strlen(value)
                        return l >= 4 && l <= 50
                      },
                      help: '请输入4~50 个字符，支持汉字、英文字母、数字、英文格式的下划线',
                      status: 'error'
                    }
                  ]}
                />
              </Control>
              <div className="help">
                填入路径将作为 API
                二级路径。支持英文、数字、下划线（_）、连字符（-），且只能以正斜线（/）开头，不超过
                200 个字符
              </div>
            </Field>
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>协议</AffixLabel>
              </Label>
              <Control tw="items-center">
                <Checkbox
                  tw="text-white!"
                  onChange={(_: any, checked: boolean) => {
                    setParams((draft) => {
                      if (checked) {
                        draft.apiAgreement = 'http'
                      }
                    })
                  }}
                >
                  HTTP
                </Checkbox>
                <Checkbox
                  tw="text-white!"
                  onChange={(_: any, checked: boolean) => {
                    setParams((draft) => {
                      if (checked) {
                        draft.apiAgreement = 'http'
                      }
                    })
                  }}
                >
                  HTTPS
                </Checkbox>
              </Control>
            </Field>
            <Field>
              <Label>
                <AffixLabel>跨域功能</AffixLabel>
              </Label>
              <Control tw="items-center">
                <Toggle
                  checked={params.isCross}
                  onChange={(checked: boolean) => {
                    setParams((draft) => {
                      draft.isCross = checked
                    })
                  }}
                />
              </Control>
              <div className="help">
                <HelpCenterLink isIframe={false} href="/xxx">
                  跨域功能说明
                </HelpCenterLink>
              </div>
            </Field>
            <RadioGroupField
              label={<AffixLabel required>请求方式</AffixLabel>}
              value={params.methods}
              name="immediately"
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.methods = v
                })
              }}
            >
              <Radio value="get">GET</Radio>
              <Radio value="post">POST</Radio>
            </RadioGroupField>
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>返回类型</AffixLabel>
              </Label>
              <Control tw="items-center">JSON</Control>
            </Field>

            <TextAreaField
              isLength
              name="Desc"
              label="描述"
              rows={3}
              value={get(params, 'Desc', '')}
              onChange={(v: string | number) =>
                setParams((draft) => {
                  draft.Desc = String(v)
                })
              }
              validateOnChange
              placeholder="请输入描述，不超过180字"
              maxLength={180}
              schemas={[
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l <= 180
                  },
                  help: '最大长度不超过180字',
                  status: 'error'
                }
              ]}
            />
            <Field>
              <Label tw="items-start!">
                <AffixLabel>创建时间</AffixLabel>
              </Label>
              <Control tw="items-center">2021.04.20 16:00:20</Control>
            </Field>
            <Field>
              <Label tw="items-start!">
                <AffixLabel>最后修改时间</AffixLabel>
              </Label>
              <Control tw="items-center">2021.04.20 16:00:20</Control>
            </Field>
          </Form>
        </FormWrapper>
      </ModalContent>
    </DarkModal>
  )
})

export default JobModal
