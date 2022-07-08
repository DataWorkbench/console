import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Form,
  Field,
  Label,
  Control,
  Icon,
  Input,
  Message,
} from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import { useMutationResource } from 'hooks'
import {
  DarkModal,
  Tooltip,
  Center,
  AffixLabel,
  PopConfirm,
  FlexBox,
} from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { formatBytes } from 'utils/convert'
import axios from 'axios'
import { useImmer } from 'use-immer'

const { TextField, TextAreaField } = Form

const ColoredIcon = styled(Icon)(() => [
  css`
    svg {
      color: ${theme('colors.green.11')} !important;
    }
  `,
])

const TextFieldWrapper = styled(TextField)(() => [
  tw`w-1/2`,
  css`
    .help {
      ${tw`pl-6`}
    }
  `,
])

const TextAreaFieldWrapper = styled(TextAreaField)(() => [
  tw`w-full break-words`,
  css`
    .control {
      ${tw`max-w-none! w-auto!`}
      textarea {
        width: 608px !important;
      }
    }
  `,
])

const InputWapper = styled(Input)(() => [
  css`
    width: 608px !important;
  `,
])

const ControlWrap = styled(Control)(() => [
  css`
    &:hover {
      input {
        ${tw`bg-neut-15`}
      }
      .icon.is-right {
        ${tw`block`}
      }
    }
  `,
])

const LoadingWrap = styled(Loading)(() => [
  css`
    ${tw`w-5! h-5!`}
    span {
      ${tw`bg-white!`}
    }
  `,
])

interface IFormFields {
  id?: String | undefined
  file?: File | undefined
  name: String
  desc: String
}

const UploadModal = (props: any) => {
  const { visible, operation, handleCancel, handleSuccess, initFields } = props

  const [fields, setFields] = useImmer<IFormFields>({
    id: undefined,
    file: undefined,
    name: '',
    desc: '',
  })
  const [fileTip, setFileTip] = useState('')
  const [isFailed, setIsFailed] = useState(false)
  const cancelRef = useRef<() => void>()
  const setCancelUpload = (c: any) => {
    cancelRef.current = c
  }

  const form = useRef<Form>(null)
  const resourceEl = useRef<HTMLInputElement>(null)
  const mutation = useMutationResource()

  useEffect(() => {
    if (initFields) {
      setFields((draft) => {
        draft.id = initFields.id
        draft.name = initFields.name
        draft.desc = initFields.desc
      })
    }
  }, [initFields, setFields])

  const closeModal = () => {
    if (cancelRef.current) {
      cancelRef.current()
      setCancelUpload(undefined)
    }

    handleCancel()
    setFileTip('')
    setIsFailed(false)
  }

  const handleFile = () => {
    if (resourceEl.current) {
      resourceEl.current.click()
    }
  }

  const handleClear = () => {
    setIsFailed(false)
    setFields((draft) => {
      draft.file = undefined
    })
    if (cancelRef.current) {
      cancelRef.current()
      setCancelUpload(undefined)
    }
  }

  const handleResourceChange = (event: any) => {
    const resource = event.target.files[0]
    const { size, name } = resource

    if (size === 0) {
      Message.error('文件大小为0')
      return
    }
    if (size > 100 * 1024 * 1024) {
      setFileTip('size')
      return
    }
    if (!/.(jar|py|zip)$/.test(name)) {
      setFileTip('type')
      return
    }

    setFileTip('')

    setFields((draft) => {
      draft.file = resource
      if (!fields.name) draft.name = name
    })
  }

  const handleOk = async () => {
    if (!form.current?.validateFields()) return

    setIsFailed(false)
    mutation.mutate(
      {
        op: operation,
        cancel: (c: any) => {
          setCancelUpload(c)
        },
        ...fields,
      },
      {
        onSuccess: async (data) => {
          if (data === 'DUPLICATE_RESOURCE_NAME') {
            Message.error('名称已存在')
            return
          }
          closeModal()
          if (handleSuccess) handleSuccess()
        },
        onError: (error) => {
          if (!axios.isCancel(error)) {
            setIsFailed(true)
          }
        },
      }
    )
  }

  return (
    <DarkModal
      width={800}
      appendToBody
      closable={false}
      escClosable={false}
      maskClosable={false}
      title={
        <FlexBox>
          <div className="modal-card-title">
            {operation === 'edit' ? '编辑' : '上传'}程序包
          </div>
          {!fields.file ? (
            <Icon name="close" tw="cursor-pointer" onClick={closeModal} />
          ) : (
            <PopConfirm
              type="warning"
              okType="danger"
              okText="确认"
              content="此时取消，将清空已上传资源并关闭弹窗，确认清空并关闭弹窗吗？"
              onOk={closeModal}
            >
              <Icon name="close" tw="cursor-pointer" />
            </PopConfirm>
          )}
        </FlexBox>
      }
      visible={visible}
      onCancel={closeModal}
      footer={
        <>
          {!fields.file ? (
            <Button tw="bg-neut-16!" onClick={closeModal}>
              取消
            </Button>
          ) : (
            <PopConfirm
              type="warning"
              okType="danger"
              okText="确认"
              content="此时取消，将清空已上传资源并关闭弹窗，确认清空并关闭弹窗吗？"
              onOk={closeModal}
            >
              <Button tw="bg-neut-16! mr-3">取消</Button>
            </PopConfirm>
          )}
          {operation === 'edit' && (
            <Button
              type="primary"
              onClick={handleOk}
              loading={mutation.isLoading}
            >
              确认
            </Button>
          )}
          {operation !== 'edit' && !fields.file && (
            <Tooltip
              theme="light"
              animation="fade"
              placement="top-end"
              content={
                <Center tw="h-9 px-3 text-neut-13">
                  请先添加符合要求的程序包
                </Center>
              }
            >
              <Button disabled tw="text-neut-8!">
                上传
              </Button>
            </Tooltip>
          )}
          {operation !== 'edit' &&
            fields.file &&
            (mutation.isLoading ? (
              <Tooltip
                theme="light"
                animation="fade"
                content={
                  <Center tw="h-9 px-3 text-neut-13">
                    上传完成后将自动关闭对话框
                  </Center>
                }
              >
                <Button type="primary" tw="cursor-not-allowed bg-green-11!">
                  <div>
                    <LoadingWrap size={20} />
                  </div>
                  <span tw="ml-1">上传中</span>
                </Button>
              </Tooltip>
            ) : (
              <Button type="primary" onClick={handleOk}>
                {isFailed ? '重试' : '上传'}
              </Button>
            ))}
        </>
      }
    >
      <Form ref={form} tw="pl-0!">
        {operation !== 'edit' && (
          <Field tw="mb-0!">
            <Label className="medium">
              <AffixLabel required>添加程序包</AffixLabel>
            </Label>
            <ControlWrap
              tw="max-w-none! w-auto!"
              className={fields.file ? 'has-icons-left has-icons-right' : ''}
            >
              {!fields.file ? (
                <Button
                  tw="bg-neut-16! border-green-11! text-green-11!"
                  onClick={handleFile}
                >
                  <input
                    accept=".jar,.py,.zip"
                    name="file"
                    type="file"
                    multiple={false}
                    tw="hidden"
                    ref={resourceEl}
                    onChange={handleResourceChange}
                  />
                  <ColoredIcon name="add" />
                  添加程序包
                </Button>
              ) : (
                <>
                  <Icon
                    className="is-left"
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      fields.file.name.includes('.jar')
                        ? 'q-jar-duotone'
                        : fields.file.name.includes('.py')
                        ? 'q-python-duotone'
                        : 'q-zip-duotone'
                    }
                  />
                  &nbsp;
                  <InputWapper />
                  <div tw="absolute left-8 top-1/2 -translate-y-1/2">
                    {fields.file.name}
                    <span tw="text-neut-8 ml-2">
                      ({formatBytes(fields.file.size, 2)})
                    </span>
                    {isFailed && (
                      <span tw="text-red-10 ml-2">文件上传失败</span>
                    )}
                  </div>
                  <Tooltip
                    theme="light"
                    placement="top"
                    content={
                      <Center tw="h-9 px-3 text-neut-13">移除资源</Center>
                    }
                  >
                    <PopConfirm
                      type="warning"
                      okText="移除"
                      okType="danger"
                      content={
                        // eslint-disable-next-line no-nested-ternary
                        cancelRef.current
                          ? '此时移除，将清空已上传资源，确定移除资源吗？'
                          : mutation.isLoading
                          ? '正在上传资源，确定取消并移除资源吗？'
                          : '确定移除资源吗？'
                      }
                      onOk={handleClear}
                      closeAfterClick={false}
                    >
                      <Icon
                        tw="hidden hover:bg-neut-13! cursor-pointer"
                        className="is-right"
                        name="close"
                        clickable
                      />
                    </PopConfirm>
                  </Tooltip>
                </>
              )}
            </ControlWrap>
          </Field>
        )}
        {operation !== 'edit' && (
          <div tw="pb-3">
            <div tw="pl-28 ml-2 pt-1 text-neut-8">
              支持 JAR，PY，ZIP 格式文件、大小不超过 500 MB、且仅支持单个上传
            </div>
            {fileTip && (
              <div tw="text-red-10 ml-2 pl-28 align-middle mt-1">
                <Icon
                  tw="inline-block align-top text-red-10"
                  name="error"
                  size="small"
                  color={{
                    primary: 'transparent',
                    secondary: '#CF3B37',
                  }}
                />
                {fileTip === 'size'
                  ? '已选文件超过 100 MB，请重新添加'
                  : '已选文件格式不合规，请重新添加'}
              </div>
            )}
          </div>
        )}
        <TextFieldWrapper
          maxLength="128"
          autoComplete="off"
          name="name"
          labelClassName="medium"
          placeholder="请输入程序包显示名"
          label={<AffixLabel required>程序包显示名</AffixLabel>}
          validateOnBlur
          validateOnChange
          disabled={operation === 'view'}
          onChange={(value: string) =>
            setFields((draft) => {
              draft.name = value
            })
          }
          value={fields.name}
          schemas={[
            {
              rule: { required: true },
              help: '请输入程序包显示名',
              status: 'error',
            },
            {
              rule: {
                matchRegex:
                  /(^(?!_)(?!.*?(_.jar)$)[a-zA-Z0-9_]+((\.jar)$))|(^(?!_)(?!.*?(_.py)$)[a-zA-Z0-9_]+((\.py$))|(^(?!_)(?!.*?(_.zip)$)[a-zA-Z0-9_]+((\.zip)$))/,
              },
              help: '只允许数字、字母或下划线(_) 且以(.jar 或 .py 或 .zip)结尾 不能以(_)开头',
              status: 'error',
            },
          ]}
        />
        <TextAreaFieldWrapper
          name="description"
          labelClassName="medium"
          label="描述"
          placeholder="请输入程序包描述"
          maxLength="500"
          disabled={operation === 'view'}
          value={fields.desc}
          onChange={(value: String) =>
            setFields((draft) => {
              draft.desc = value
            })
          }
        />
      </Form>
    </DarkModal>
  )
}

export default UploadModal
