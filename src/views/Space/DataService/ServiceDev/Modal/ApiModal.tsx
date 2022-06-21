import { useRef } from 'react'
import { useImmer } from 'use-immer'
import { AffixLabel, Modal, ModalContent, TextLink } from 'components'
import { get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useMutationApiService, useQueryListApiGroups } from 'hooks'
import { strlen } from 'utils'
import { Checkbox, Control, Field, Form, Label, Radio, Input, Button, Toggle } from '@QCFE/lego-ui'
import { HelpCenterLink } from 'components/Link'
import { useParams } from 'react-router-dom'
import { ApiProps } from 'stores/DtsDevStore'
import ModelItem from './ModeItem'

const { TextField, SelectField, RadioGroupField, TextAreaField } = Form

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

interface JobModalProps {
  isEdit?: boolean
  currentApi?: ApiProps
  onClose?: (data?: JobModalData) => void
}

const modelSource = [
  {
    value: 1,
    title: '向导模式',
    desc: (
      <div className="des">
        即可视化配置，快速将结构化数据和半结构化数据表生成数据API。您无需具备编码能力，即可快速配置一个数据API。
        <TextLink href="/iaas/vpc/create" target="_blank" hasIcon>
          查看详情
        </TextLink>
      </div>
    )
  },
  {
    value: 2,
    title: '脚本模式(敬请期待)',
    disabled: true,
    desc: (
      <div className="des">
        为满足高阶用户的个性化查询需求，为您提供自定义 SQL 的脚本，您可以自行编写 API 的查询 SQL
        。支持多表关联、复杂查询和聚合函数等功能。
        <TextLink href="/iaas/vpc/create" target="_blank" hasIcon>
          查看详情
        </TextLink>
      </div>
    )
  }
]

export const JobModal = observer((props: JobModalProps) => {
  const { isEdit = false, onClose, currentApi } = props
  const { spaceId } = useParams<{ spaceId: string }>()

  const form = useRef<Form>(null)
  const [params, setParams] = useImmer(() => ({
    api_mode: 1,
    group_id: '',
    api_name: '',
    api_path: '/',
    apiAgreement: '',
    cross_domain: false,
    request_method: '',
    response_type: 'json',
    api_description: ''
  }))

  const mutation = useMutationApiService()
  const { data } = useQueryListApiGroups({ uri: { space_id: spaceId } })
  const apiGroupList = get(data, 'infos', [])

  const handleOK = () => {
    if (form.current?.validateForm()) {
      const paramsData = {
        option: 'createApi' as const,
        ...params
      }
      mutation.mutate(paramsData, {
        onSuccess: () => {
          onClose?.()
        }
      })
    }
  }

  if (isEdit && !!currentApi) {
    console.log(currentApi)

    // setParams(date => {
    //   date.api_mode = currentApi.api_mode
    //   date.group_id = currentApi.group_id
    //   date.api_name = currentApi.api_name
    //   date.api_path = currentApi.api_path
    //   date.apiAgreement = currentApi.apiAgreement
    //   date.cross_domain = currentApi.cross_domain
    //   date.request_method = currentApi.request_method
    //   date.response_type = currentApi.response_type
    //   date.api_description = currentApi.api_description
    // })
  }

  return (
    <Modal
      visible
      title={`${isEdit ? '修改' : '创建'}API`}
      width={900}
      maskClosable={false}
      appendToBody
      draggable
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={() => onClose?.()}>取消</Button>
          <Button type="primary" loading={mutation.isLoading} onClick={handleOK}>
            创建并配置
          </Button>
        </div>
      }
    >
      <ModalContent>
        <FormWrapper>
          <Form layout="horizon" ref={form}>
            <Field
              values={params.api_mode}
              schemas={[
                {
                  rule: {
                    required: true
                  },
                  status: 'error',
                  help: '不能为空'
                }
              ]}
            >
              <Label tw="items-start!">
                <AffixLabel required>API配置模式</AffixLabel>
              </Label>
              <Control tw="max-w-full! items-center space-x-1 block!">
                {modelSource.map((item) => (
                  <ModelItem
                    selected={params.api_mode === item.value}
                    key={item.value}
                    onClick={() =>
                      setParams((draft) => {
                        draft.api_mode = item.value
                      })
                    }
                    modeData={item}
                  />
                ))}
              </Control>
            </Field>
            <SelectField
              label={<AffixLabel required>API 服务组</AffixLabel>}
              name="version"
              validateOnChange
              placeholder="请选择API服务组"
              options={apiGroupList.map((item) => ({
                label: item.name,
                value: item.id
              }))}
              value={params.group_id}
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.group_id = v
                })
              }}
              schemas={[
                {
                  rule: {
                    required: true,
                    isExisty: false
                  },
                  status: 'error',
                  help: '不能为空'
                }
              ]}
              css={[
                css`
                  .select-control {
                    ${tw`w-[326px]!`}
                  }
                `
              ]}
            />
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
                  name="group_id"
                  value={get(params, 'group_id', '')}
                  disabled
                  tw="w-[150px]! block! items-center! space-x-1 mr-2"
                />
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
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.request_method = v
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
          </Form>
        </FormWrapper>
      </ModalContent>
    </Modal>
  )
})

export default JobModal
