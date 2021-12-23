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
import { observer } from 'mobx-react-lite'
import { getResourcePageQueryKey, useMutationResource, useStore } from 'hooks'
import {
  DarkModal,
  Tooltip,
  Center,
  AffixLabel,
  TextLink,
  PopConfirm,
} from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { useQueryClient } from 'react-query'
import { loadResourceList } from 'stores/api'
import { useParams } from 'react-router-dom'
import { formatBytes } from 'utils/convert'
import axios from 'axios'
import {
  // PackageDocsHref,
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

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

const UploadModal = observer((props: any) => {
  const {
    dmStore: { setOp, op },
  } = useStore()
  const { visible, handleCancel, type: packageType, defaultFields } = props

  const { regionId, spaceId } = useParams<IRouteParams>()

  const [resourceName, setResourceName] = useState(
    (op !== 'create' && defaultFields.name) || ''
  )
  const [fileTip, setFileTip] = useState('')
  const [file, setFile] = useState<File>()
  const [cancelUpload, setCancelUpload] = useState<() => void>()
  const [isFailed, setIsFailed] = useState(false)

  const resourceEl = useRef<HTMLInputElement>(null)
  const form = useRef<Form>(null)

  const mutation = useMutationResource()

  const queryClient = useQueryClient()

  useEffect(() => {
    form.current?.validateFields()
  }, [resourceName])

  useEffect(() => {
    if (visible) setResourceName(defaultFields.name || '')
  }, [defaultFields.name, visible])

  const closeModal = () => {
    if (cancelUpload) {
      cancelUpload()
      setCancelUpload(undefined)
    }

    handleCancel()
    setFile(undefined)
    setOp('')
    setResourceName('')
    setFileTip('')
    setIsFailed(false)
  }

  const handleFile = () => {
    if (resourceEl.current) {
      resourceEl.current.click()
    }
  }

  const handleClear = () => {
    setFile(undefined)
    if (cancelUpload) {
      cancelUpload()
      setCancelUpload(undefined)
    }
  }

  const handleResourceChange = (event: any) => {
    const resource = event.target.files[0]

    if (resource.size === 0) {
      Message.error('文件大小为0')
      return
    }
    if (resource.size > 100 * 1024 * 1024) {
      setFileTip('size')
      return
    }
    if (!/.jar$/.test(resource.name)) {
      setFileTip('type')
      return
    }
    setFile(resource)
    setFileTip('')
    if (!resourceName) setResourceName(resource.name)
  }

  const handleOk = async () => {
    if (!form.current?.validateFields()) return
    const fields = form.current?.getFieldsValue() || {}
    if (op === 'create') {
      const ret = await loadResourceList({
        regionId,
        spaceId,
        resource_name: fields.resource_name,
        resource_type: PackageTypeMap[packageType],
      })
      if (ret.infos?.length > 0) {
        Message.error('名称已存在')
        return
      }
    }

    setIsFailed(false)

    const params = {
      resource_type: PackageTypeMap[packageType],
      ...fields,
      file,
      resource_id: defaultFields.resource_id,
    }
    mutation.mutate(
      {
        op,
        cancel: (c: any) => {
          setCancelUpload(() => () => c())
        },
        ...params,
      },
      {
        onSuccess: async () => {
          setOp('')
          handleCancel()
          setFile(undefined)
          queryClient.invalidateQueries(getResourcePageQueryKey())
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
      closable={false}
      escClosable={false}
      maskClosable={false}
      title={`${op === 'edit' ? '编辑' : '上传'}${PackageName[packageType]}`}
      visible={visible}
      onCancel={closeModal}
      footer={
        <>
          {!file ? (
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
          {op === 'edit' && (
            <Button
              type="primary"
              onClick={handleOk}
              loading={mutation.isLoading}
            >
              确认
            </Button>
          )}
          {op !== 'edit' && !file && (
            <Tooltip
              theme="light"
              animation="fade"
              placement="top-end"
              content={
                <Center tw="h-9 px-3 text-neut-13">
                  请先添加符合要求的{PackageName[packageType]}
                </Center>
              }
            >
              <Button disabled tw="text-neut-8!">
                上传
              </Button>
            </Tooltip>
          )}
          {op !== 'edit' &&
            file &&
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
              <TextLink
                // href={PackageDocsHref[packageType]}
                target="_blank"
                rel="noreferrer"
                hasIcon={false}
              >
                查看详情 →
              </TextLink>
            </LevelRight>
          </Level>
        }
      />
      <Form ref={form} tw="pl-0!">
        {op !== 'edit' && (
          <Field tw="mb-0!">
            <Label className="medium">
              <AffixLabel required>添加{PackageName[packageType]}</AffixLabel>
            </Label>
            <ControlWrap
              tw="max-w-none! w-auto!"
              className={file ? 'has-icons-left has-icons-right' : ''}
            >
              {!file ? (
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
                  添加{PackageName[packageType]}
                </Button>
              ) : (
                <>
                  <Icon className="is-left" name="jar" />
                  &nbsp;
                  <InputWapper />
                  <div tw="absolute left-8 top-1/2 -translate-y-1/2">
                    {file.name}
                    <span tw="text-neut-8 ml-2">
                      ({formatBytes(file.size, 2)})
                    </span>
                    {isFailed && (
                      <span tw="text-red-10 ml-2">文件上传失败</span>
                    )}
                  </div>
                  {cancelUpload ? (
                    <PopConfirm
                      type="warning"
                      okText="移除"
                      okType="danger"
                      content="此时移除，将清空已上传资源，确定移除资源吗？"
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
                  ) : (
                    <Tooltip
                      theme="light"
                      placement="top"
                      content={
                        <Center tw="h-9 px-3 text-neut-13">移除资源</Center>
                      }
                    >
                      <Icon
                        tw="hidden hover:bg-neut-13! cursor-pointer"
                        className="is-right"
                        name="close"
                        clickable
                        onClick={handleClear}
                      />
                    </Tooltip>
                  )}
                </>
              )}
            </ControlWrap>
          </Field>
        )}
        {op !== 'edit' && (
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
          name="resource_name"
          labelClassName="medium"
          placeholder={`请输入${PackageName[packageType]}显示名`}
          label={
            <AffixLabel required>{PackageName[packageType]}显示名</AffixLabel>
          }
          validateOnBlur
          schemas={[
            {
              rule: { required: true },
              help: `请输入${PackageName[packageType]}显示名`,
              status: 'error',
            },
            {
              rule: { matchRegex: /^(?!_)(?!.*?_$)[a-zA-Z0-9_.]+$/ },
              help: '只允许数字、字母或下划线(_) 不能以(_)开头',
              status: 'error',
            },
            {
              rule: { matchRegex: /.jar$/ },
              help: '请以(.jar)扩展名结尾',
              status: 'error',
            },
          ]}
          disabled={op === 'view'}
          value={resourceName}
          onChange={(value: string) => setResourceName(value)}
        />
        <TextAreaFieldWrapper
          name="description"
          labelClassName="medium"
          label="描述"
          placeholder={`请输入${PackageName[packageType]}描述`}
          maxLength="500"
          disabled={op === 'view'}
          defaultValue={(op !== 'create' && defaultFields.description) || ''}
        />
      </Form>
    </DarkModal>
  )
})

export default UploadModal
