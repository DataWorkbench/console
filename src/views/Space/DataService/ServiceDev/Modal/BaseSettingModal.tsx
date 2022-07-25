import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { AffixLabel, DarkModal, ModalContent, InputField } from 'components'
import { cloneDeep, get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore, useMutationUpdateApiConfig } from 'hooks'
import { strlen, formatDate } from 'utils'
import { Control, Field, Form, Label, Radio, Button, Toggle } from '@QCFE/lego-ui'
import { HelpCenterLink } from 'components/Link'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { Protocol, RequestMethods, ResponseMethods } from '../constants'
import ApiPathField from '../components/ApiPathField'

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

const BaseSettingModal = observer(() => {
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
    updated: 0,
    api_mode: 0,
    group_id: ''
  }))

  const {
    dtsDevStore: { apiConfigData, treeData, setTreeData, curApi },
    dtsDevStore
  } = useStore()
  const mutation = useMutationUpdateApiConfig()
  const isHistory = get(curApi, 'is_history', false) || false

  const onClose = () => {
    dtsDevStore.set({ showBaseSetting: false })
  }
  // 启动后回显数据
  useEffect(() => {
    if (apiConfigData) {
      const apiConfig = cloneDeep(get(apiConfigData, 'api_config', {}))
      const GroupConfig = cloneDeep(get(apiConfigData, 'api_group', {}))
      const apiPath = get(apiConfig, 'api_path', '/').split('/').splice(-1)

      setParams((draft) => {
        draft.api_id = get(apiConfig, 'api_id', '')
        draft.group_name = get(GroupConfig, 'name', '')
        draft.api_name = get(apiConfig, 'api_name', '')
        draft.group_path = get(GroupConfig, 'group_path', '')
        draft.api_path = apiPath.length > 0 ? apiPath[0] : ''
        draft.protocols = get(apiConfig, 'protocols', Protocol.HTTP)
        draft.cross_domain = get(apiConfig, 'cross_domain', false)
        draft.request_method = get(apiConfig, 'request_method', RequestMethods.GET)
        draft.response_type = get(apiConfig, 'response_type', ResponseMethods.JSON)
        draft.api_description = get(apiConfig, 'api_description', '')
        draft.timeout = get(apiConfig, 'timeout', '')
        draft.created = get(apiConfig, 'created', 0)
        draft.updated = get(apiConfig, 'updated', 0)
        draft.api_mode = get(apiConfig, 'api_mode', 0)
        draft.group_id = get(GroupConfig, 'id', '')
      })
    }
  }, [setParams, apiConfigData])

  const handleSyncStore = () => {
    const newTreeData = treeData.map((api) => {
      const { children } = api
      if (children) {
        const newChildren = children.map((item: { id: string }) => {
          if (item.id === params.api_id) {
            return {
              ...item,
              title: params.api_name
            }
          }
          return item
        })
        return {
          ...api,
          children: newChildren
        }
      }
      return api
    })

    const config = {
      ...cloneDeep(apiConfigData),
      api_config: {
        ...cloneDeep(apiConfigData?.api_config),
        ...params
      }
    }
    dtsDevStore.set({
      apiConfigData: config
    })
    setTreeData(newTreeData)
  }

  const handleOK = () => {
    if (form.current?.validateForm()) {
      const dataSource = cloneDeep(get(apiConfigData, 'data_source'))
      const apiConfig: any = cloneDeep(get(apiConfigData, 'api_config', {}))
      if (!dataSource?.id) {
        Notify.warning({
          title: '操作提示',
          content: '请先选择数据源',
          placement: 'bottomRight'
        })
        return
      }

      mutation.mutate(
        {
          apiId: params.api_id,
          datasource_id: dataSource.id,
          table_name: apiConfig?.table_name,
          ...params,
          api_path: `/${params.api_path.trim()}`
        },
        {
          onSuccess: (res) => {
            if (res.ret_code === 0) {
              Notify.success({
                title: '操作提示',
                content: '配置保存成功',
                placement: 'bottomRight'
              })
              handleSyncStore()
              onClose()
            }
          }
        }
      )
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
              disabled={isHistory}
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
              maxLength={50}
              schemas={[
                {
                  rule: (value: string) => {
                    const reg = /^[a-zA-Z0-9_]{4,50}$/
                    return reg.test(value)
                  },
                  help: '请输入4~50 个字符，英文字母、数字、英文格式的下划线',
                  status: 'error'
                }
              ]}
              help="填入路径将作为 API
                二级路径。支持英文、数字、下划线（_）、连字符（-），不超过
                200 个字符"
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
                  draft.timeout = (Number(v) || 0) as unknown as string
                })
              }
              maxLength={3}
              schemas={[
                {
                  rule: (value: number) => {
                    const l = Number(value)
                    return l >= 2 && l <= 300
                  },
                  help: '请输入范围0-300',
                  status: 'error'
                }
              ]}
              help="0-300"
              suffix={<div tw="ml-1">S</div>}
            />
            <Field>
              <Label>
                <AffixLabel>跨域功能</AffixLabel>
              </Label>
              <Control tw="items-center">
                <Toggle
                  disabled={isHistory}
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
              disabled={isHistory}
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
              disabled={isHistory}
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
              <Label tw="items-start!">创建时间</Label>
              <Control tw="items-center">{formatDate(params.created)}</Control>
            </Field>
            <Field>
              <Label tw="items-start!">最后修改时间</Label>
              <Control tw="items-center">{formatDate(params.updated)}</Control>
            </Field>
          </Form>
        </FormWrapper>
      </ModalContent>
    </DarkModal>
  )
})

export default BaseSettingModal
