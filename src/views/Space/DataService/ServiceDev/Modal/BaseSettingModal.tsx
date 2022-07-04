import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { AffixLabel, DarkModal, ModalContent } from 'components'
import { cloneDeep, get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import { strlen, formatDate } from 'utils'
import { Control, Field, Form, Label, Radio, Input, Button, Toggle } from '@QCFE/lego-ui'
import { HelpCenterLink } from 'components/Link'
import { Protocol, RequestMethods, ResponseMethods } from '../constants'

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
    group_name: '',
    api_id: '',
    api_name: '',
    api_path: '/',
    group_path: '/',
    protocols: Protocol.HTTP,
    cross_domain: false,
    request_method: RequestMethods.GET,
    response_type: ResponseMethods.JSON,
    api_description: '',
    timeout: '',
    created: 0,
    updated: 0
  }))

  const {
    dtsDevStore: { apiConfigData },
    dtsDevStore
  } = useStore()

  const onClose = () => {
    dtsDevStore.set({ showBaseSetting: false })
  }

  // 启动后回显数据
  useEffect(() => {
    if (apiConfigData) {
      const data = cloneDeep(get(apiConfigData, 'api_config', []))
      console.log(data)

      setParams((draft) => {
        draft.api_id = get(data, 'api_id', '')
        draft.group_name = get(data, 'group_name', 'APX 服务组') // TODO: 后端接口没有group_name
        draft.api_name = get(data, 'api_name', '')
        draft.group_path = get(data, 'group_path', '/') // TODO: 后端接口没有group_path
        draft.api_path = get(data, 'api_path', '/')
        draft.protocols = get(data, 'protocols', Protocol.HTTP)
        draft.cross_domain = get(data, 'cross_domain', false)
        draft.request_method = get(data, 'request_method', RequestMethods.GET)
        draft.response_type = get(data, 'response_type', ResponseMethods.JSON)
        draft.api_description = get(data, 'api_description', '')
        draft.timeout = get(data, 'timeout', '')
        draft.created = get(data, 'created', 0)
        draft.updated = get(data, 'updated', 0)
      })
    }
  }, [apiConfigData, setParams])

  const handleOK = () => {
    if (form.current?.validateForm()) {
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
      maskClosable={false}
      closable={false}
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
              <Control tw="items-center">{params.group_name}</Control>
            </Field>
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>API ID</AffixLabel>
              </Label>
              <Control tw="items-center">{params.api_id}</Control>
            </Field>
            <TextField
              name="api_name"
              label={<AffixLabel>API名称</AffixLabel>}
              value={get(params, 'api_name', '')}
              onChange={(v: string | number) =>
                setParams((draft) => {
                  draft.api_name = String(v)
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
                  name="group_path"
                  value={get(params, 'group_path', '')}
                  disabled
                  tw="w-[150px]! block! items-center! space-x-1 mr-2"
                />

                <Input value="/" disabled tw="w-[40px]! block!" />
                <Input
                  name="api_path"
                  value={get(params, 'api_path', '')}
                  onChange={(_, v: string | number) =>
                    setParams((draft) => {
                      draft.api_path = String(v)
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
                HTTP
                {/* <Checkbox
                  tw="text-white!"
                  checked={params.protocols === Protocol.HTTP}
                  onChange={(_: any, checked: boolean) => {
                    setParams((draft) => {
                      if (checked) {
                        draft.protocols = 1
                      }
                    })
                  }}
                >
                  HTTP
                </Checkbox> */}
              </Control>
            </Field>
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>超时时间</AffixLabel>
              </Label>
              <Control tw="items-center">
                <Input
                  name="timeout"
                  tw="w-[60px]! block! items-center! space-x-1 mr-2"
                  value={get(params, 'timeout', '')}
                  onChange={(_, v: any) =>
                    setParams((draft) => {
                      draft.timeout = Number(v) as unknown as string
                    })
                  }
                  validateOnChange
                  maxLength={50}
                  schemas={[
                    {
                      rule: (value: number) => {
                        const l = Number(value)
                        return l >= 0 && l <= 300
                      },
                      help: '请输入范围0-300',
                      status: 'error'
                    }
                  ]}
                />
                <div tw="ml-1">S</div>
              </Control>
              <div className="help">0-300</div>
            </Field>
            <Field>
              <Label>
                <AffixLabel>跨域功能</AffixLabel>
              </Label>
              <Control tw="items-center">
                <Toggle
                  checked={params.cross_domain}
                  onChange={(checked: boolean) => {
                    setParams((draft) => {
                      draft.cross_domain = checked
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
              value={params.request_method}
              name="immediately"
              onChange={(v: number) => {
                setParams((draft) => {
                  draft.request_method = v
                })
              }}
            >
              <Radio value={RequestMethods.GET}>GET</Radio>
              <Radio value={RequestMethods.POST}>POST</Radio>
            </RadioGroupField>
            <Field>
              <Label tw="items-start!">
                <AffixLabel required>返回类型</AffixLabel>
              </Label>
              <Control tw="items-center">JSON</Control>
            </Field>

            <TextAreaField
              name="api_description"
              label="描述"
              rows={3}
              value={get(params, 'api_description', '')}
              onChange={(v: string | number) =>
                setParams((draft) => {
                  draft.api_description = String(v)
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
              <Control tw="items-center">{formatDate(params.created)}</Control>
            </Field>
            <Field>
              <Label tw="items-start!">
                <AffixLabel>最后修改时间</AffixLabel>
              </Label>
              <Control tw="items-center">{formatDate(params.updated)}</Control>
            </Field>
          </Form>
        </FormWrapper>
      </ModalContent>
    </DarkModal>
  )
})

export default JobModal
