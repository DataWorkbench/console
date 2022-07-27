import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { AffixLabel, Modal, ModalContent } from 'components'
import { Form, Button } from '@QCFE/qingcloud-portal-ui'
import { get, merge } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useMutationApiService, getQueryKeyListApiGroups } from 'hooks'
import { strlen } from 'utils'
import { useQueryClient } from 'react-query'
import { useStore } from 'stores/index'
import type { CurrentGroupApiProps } from '../ApiPanel/ApiTree'
import ApiPathField from '../components/ApiPathField'

const { TextField, TextAreaField } = Form

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
  currentGroup?: CurrentGroupApiProps
  onClose?: (data?: JobModalData) => void
}

const ApiGroupModal = observer((props: JobModalProps) => {
  const { isEdit = false, currentGroup, onClose } = props
  const {
    dtsDevStore: { resetTreeData }
  } = useStore()

  const form = useRef<Form>(null)
  const [params, setParams] = useImmer(() => ({
    name: '',
    group_path: '',
    desc: ''
  }))

  useEffect(() => {
    if (currentGroup) {
      const path = get(currentGroup, 'group_path', '').split('/').splice(-1).join()
      setParams((date) => {
        date.group_path = path
        date.name = currentGroup?.name || ''
        date.desc = currentGroup.desc || ''
      })
    }
  }, [currentGroup, setParams])

  const queryClient = useQueryClient()
  const mutation = useMutationApiService()

  const handleOK = () => {
    if (form.current?.validateForm()) {
      const paramsData = merge(
        {
          option: isEdit ? 'updateApiGroup' : ('createApiGroup' as const),
          ...params,
          group_path: `/${params.group_path}`
        },
        isEdit ? { groupId: currentGroup?.id } : {}
      )
      mutation.mutate(paramsData, {
        onSuccess: () => {
          queryClient.invalidateQueries(getQueryKeyListApiGroups())
          resetTreeData()
          onClose?.()
        }
      })
    }
  }

  return (
    <Modal
      visible
      title={`${isEdit ? '修改' : '创建'}API服务组`}
      width={900}
      maskClosable={false}
      appendToBody
      draggable
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={() => onClose?.()}>取消</Button>
          <Button type="primary" loading={mutation.isLoading} onClick={handleOK}>
            {isEdit ? '保存' : '创建'}
          </Button>
        </div>
      }
    >
      <ModalContent>
        <FormWrapper>
          <Form layout="horizon" ref={form}>
            <TextField
              name="name"
              label={<AffixLabel>API服务组名称</AffixLabel>}
              value={get(params, 'name', '')}
              onChange={(v: string | number) =>
                setParams((draft) => {
                  draft.name = String(v)
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
            <ApiPathField
              showGroupPath={false}
              name="group_path"
              label={<AffixLabel>API服务组路径</AffixLabel>}
              value={get(params, 'group_path', '')}
              onChange={(v) =>
                setParams((draft) => {
                  draft.group_path = String(v)
                })
              }
              validateOnChange
              maxLength={20}
              schemas={[
                {
                  rule: (value: string) => {
                    const reg = /^[a-zA-Z0-9_]{1,20}$/
                    return reg.test(value)
                  },
                  help: '请输入1~20 个字符，英文字母、数字、英文格式的下划线',
                  status: 'error'
                }
              ]}
              help="此路径将作为 API 一级路径。支持英文、数字、下划线（_）、连字符（-），不超过 20 个字符"
            />
            <TextAreaField
              name="desc"
              label="描述"
              rows={3}
              value={get(params, 'desc', '')}
              onChange={(v: string | number) =>
                setParams((draft) => {
                  draft.desc = String(v)
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

export default ApiGroupModal
