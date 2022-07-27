import { useEffect, useRef, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { AffixLabel, Modal, ModalContent, TextLink, InputField } from 'components'
import { get, merge, pickBy } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useMutationApiService, useQueryListApiGroups, useStore, useFetchApi } from 'hooks'
import { strlen } from 'utils'
import { Control, Field, Form, Label, Radio, Button, Toggle } from '@QCFE/lego-ui'
import { HelpCenterLink } from 'components/Link'
import { useParams } from 'react-router-dom'
import ModelItem from './ModeItem'
import { Protocol, RequestMethods, ResponseMethods } from '../constants'
import type { CurrentGroupApiProps } from '../ApiPanel/ApiTree'
import { getNewTreeData } from '../ApiPanel/ApiUtils'
import ApiPathField from '../components/ApiPathField'

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
      .inputField {
        .control {
          ${tw`dark:bg-neut-16! border-0 p-0!`}
          input {
            ${tw`w-[60px] border! border-solid hover:border-neut-5 border-neut-13 focus:border-green-13 px-3 py-2`}
          }
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
  currentGroup?: CurrentGroupApiProps
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

const ApiModal = observer((props: JobModalProps) => {
  const { onClose, currentGroup } = props
  const { spaceId } = useParams<{ spaceId: string }>()
  const {
    dtsDevStore: { setTreeData, treeData }
  } = useStore()
  const fetchApi = useFetchApi()

  const refetchApiGroup = (groupId: string) => {
    fetchApi({
      groupId
    }).then((data) => {
      const apis = get(data, 'infos', []) || []
      const newTreeData = getNewTreeData(treeData, { key: groupId }, apis, null)
      setTreeData(newTreeData)
    })
  }

  const form = useRef<Form>(null)
  const [params, setParams] = useImmer(() => ({
    api_mode: 1,
    group_path: '',
    group_name: '',
    api_name: '',
    api_path: '',
    protocols: Protocol.HTTP,
    cross_domain: true,
    request_method: RequestMethods.GET,
    response_type: ResponseMethods.JSON,
    api_description: '',
    timeout: 1
  }))

  const mutation = useMutationApiService()
  const { data } = useQueryListApiGroups({ uri: { space_id: spaceId } })
  const apiGroupList = useMemo(() => get(data, 'infos', []) || [], [data])

  const handleOK = () => {
    if (form.current?.validateForm()) {
      const groupId = apiGroupList.find((item) => item.name === params.group_name)?.id || ''

      const paramsData = merge({
        option: 'createApi' as const,
        ...pickBy(params, (v, k) => !['group_path', 'group_name'].includes(k)),
        api_path: `/${params.api_path}`,
        group_id: groupId,
        space_id: spaceId
      })

      mutation.mutate(paramsData, {
        onSuccess: () => {
          refetchApiGroup(groupId)
          onClose?.()
        }
      })
    }
  }

  useEffect(() => {
    if (currentGroup) {
      const group2 = apiGroupList.find((item) => item.id === currentGroup.id)
      setParams((date) => {
        date.group_path = group2?.group_path || '/'
        date.group_name = group2?.name || ''
      })
    }
  }, [apiGroupList, setParams, currentGroup])

  return (
    <Modal
      visible
      title="创建API"
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
            {currentGroup?.id ? (
              <Field>
                <Label tw="items-start!">
                  <AffixLabel required>API 服务组</AffixLabel>
                </Label>
                <Control tw="items-center">{params.group_name}</Control>
              </Field>
            ) : (
              <SelectField
                label={<AffixLabel required>API 服务组</AffixLabel>}
                name="version"
                validateOnChange
                placeholder="请选择API服务组"
                options={apiGroupList.map((item) => ({
                  label: item.name,
                  value: item.name
                }))}
                value={params.group_name}
                onChange={(v: string) => {
                  const path = apiGroupList.find((item) => item.name === v)?.group_path || '/'
                  setParams((draft) => {
                    draft.group_path = path
                    draft.group_name = v
                  })
                }}
                schemas={[
                  {
                    rule: {
                      required: true
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
            )}
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
                <>支持中文、英文、数字、下划线（_），且只能以英文或中文开头，长度为 4~50 个字符</>
              }
            />
            <ApiPathField
              label={<AffixLabel required>API路径</AffixLabel>}
              groupPath={get(params, 'group_path', '')}
              name="api_path"
              value={get(params, 'api_path', '')}
              onChange={(v) =>
                setParams((draft) => {
                  draft.api_path = String(v)
                })
              }
              validateOnChange
              placeholder="请输入API路径"
              maxLength={200}
              schemas={[
                {
                  rule: (value: string) => {
                    const reg = /^[a-zA-Z0-9_]{1,200}$/
                    return reg.test(value)
                  },
                  help: '请输入1~200 个字符，英文字母、数字、英文格式的下划线',
                  status: 'error'
                }
              ]}
              help="填入路径将作为 API 二级路径。支持英文、数字、下划线（_）、连字符（-），不超过 200 个字符"
            />
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
            <InputField
              name="timeout"
              className="inputField"
              label={<AffixLabel required>超时时间</AffixLabel>}
              validateOnChange
              value={get(params, 'timeout', '')}
              onChange={(v) =>
                setParams((draft) => {
                  draft.timeout = (Number(v) || '') as unknown as number
                })
              }
              maxLength={3}
              schemas={[
                {
                  rule: (value: number) => {
                    const l = Number(value)
                    return l >= 1 && l <= 300
                  },
                  help: '请输入范围1-300',
                  status: 'error'
                }
              ]}
              help="1-300"
              suffix={<div tw="ml-1">s</div>}
            />
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
          </Form>
        </FormWrapper>
      </ModalContent>
    </Modal>
  )
})

export default ApiModal
