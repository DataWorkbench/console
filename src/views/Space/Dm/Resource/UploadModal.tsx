import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Form,
  Field,
  Label,
  Control,
  Icon,
  Input,
  Message,
  Level,
  LevelLeft,
  LevelRight,
} from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import { useMutationResource } from 'hooks'
import {
  DarkModal,
  Tooltip,
  Center,
  AffixLabel,
  PopConfirm,
  HelpCenterLink,
} from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { formatBytes } from 'utils/convert'
import axios from 'axios'
import { useImmer } from 'use-immer'
import {
  PackageDocsHref,
  PackageName,
  PackageTypeMap,
  PackageTypeTip,
} from './constants'

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

type IPackageType = 'program' | 'function' | 'dependency'

interface IFormFields {
  id?: String | undefined
  type: Number
  file?: File | undefined
  name: String
  desc: String
}

const getDefaultFields = (type: IPackageType) => ({
  id: undefined,
  type: PackageTypeMap[type],
  file: undefined,
  name: '',
  desc: '',
})

const UploadModal = (props: any) => {
  const {
    visible,
    operation,
    handleCancel,
    handleSuccess,
    type: packageType,
    initFields,
  } = props

  const PackageNameByType = PackageName[packageType]
  const defaultFields = getDefaultFields(packageType)

  const [fields, setFields] = useImmer<IFormFields>(defaultFields)
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
        draft.type = initFields.type
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
    setFields(defaultFields)
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
    if (!/.jar$/.test(name)) {
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
      title={`${operation === 'edit' ? '编辑' : '上传'}${PackageNameByType}`}
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
                  请先添加符合要求的{PackageNameByType}
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
      <Alert
        type="info"
        tw="mb-4"
        message={
          <Level as="nav">
            <LevelLeft>{PackageTypeTip[packageType]}</LevelLeft>
            <LevelRight>
              <HelpCenterLink
                href={PackageDocsHref[packageType]}
                isIframe={false}
              >
                查看详情
              </HelpCenterLink>
            </LevelRight>
          </Level>
        }
      />
      <Form ref={form} tw="pl-0!">
        {operation !== 'edit' && (
          <Field tw="mb-0!">
            <Label className="medium">
              <AffixLabel required>添加{PackageNameByType}</AffixLabel>
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
                    accept=".jar"
                    name="file"
                    type="file"
                    multiple={false}
                    tw="hidden"
                    ref={resourceEl}
                    onChange={handleResourceChange}
                  />
                  <ColoredIcon name="add" />
                  添加{PackageNameByType}
                </Button>
              ) : (
                <>
                  <Icon className="is-left" name="jar" />
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
              仅支持 .jar 格式文件、大小不超过 100 MB、且仅支持单个上传
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
          placeholder={`请输入${PackageNameByType}显示名`}
          label={<AffixLabel required>{PackageNameByType}显示名</AffixLabel>}
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
              help: `请输入${PackageNameByType}显示名`,
              status: 'error',
            },
            {
              rule: {
                matchRegex: /^(?!_)(?!.*?(_.jar)$)[a-zA-Z0-9_]+((\.jar)$)/,
              },
              help: '只允许数字、字母或下划线(_) 且以(.jar)结尾 不能以(_)开头',
              status: 'error',
            },
          ]}
        />
        <TextAreaFieldWrapper
          name="description"
          labelClassName="medium"
          label="描述"
          placeholder={`请输入${PackageNameByType}描述`}
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
