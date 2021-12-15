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
  PopConfirm,
} from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { getResourcePageQueryKey, useMutationResource, useStore } from 'hooks'
import { DarkModal, Tooltip, Center, AffixLabel } from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { useQueryClient } from 'react-query'
import { loadResourceList } from 'stores/api'
import { useParams } from 'react-router-dom'

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

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

const UploadModal = observer((props: any) => {
  const {
    dmStore: { setOp, op },
  } = useStore()

  const resourceEl = useRef<HTMLInputElement>(null)
  const form = useRef<Form>(null)
  const [file, setFile] = useState<File>()
  const { regionId, spaceId } = useParams<IRouteParams>()

  const { visible, handleCancel, type: packageType, defaultFields } = props

  const packageTypeName = packageType === 'program' ? '程序包' : '函数包'

  const mutation = useMutationResource()

  const queryClient = useQueryClient()

  const closeModal = () => {
    handleCancel()
    setFile(undefined)
    setOp('')
  }

  const handleFile = () => {
    if (resourceEl.current) {
      resourceEl.current.click()
    }
  }

  const handleClear = () => {
    setFile(undefined)
  }

  const handleResourceChange = (event: any) => {
    setFile(event.target.files[0])
  }

  const handleOk = async () => {
    if (!form.current?.validateFields()) return
    const fields = form.current?.getFieldsValue() || {}
    if (op === 'create') {
      const ret = await loadResourceList({
        regionId,
        spaceId,
        resource_name: fields.resource_name,
        resource_type: packageType === 'program' ? 1 : 2,
      })
      if (ret.infos?.length > 0) {
        Message.error('名称已存在')
        return
      }
    }

    const params = {
      resource_type: packageType === 'program' ? 1 : 2,
      ...fields,
      file,
      resource_id: defaultFields.resource_id,
    }
    mutation.mutate(
      {
        op,
        ...params,
      },
      {
        onSuccess: async () => {
          setOp('')
          handleCancel()
          setFile(undefined)
          queryClient.invalidateQueries(getResourcePageQueryKey())
        },
      }
    )
  }

  return (
    <DarkModal
      width={800}
      title={`${op === 'edit' ? '编辑' : '上传'}${packageTypeName}`}
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
              content={
                <div tw="text-neut-16">
                  此时取消，将清空已上传资源并关闭弹窗，确认清空并关闭弹窗吗？
                </div>
              }
              onOk={closeModal}
              closeAfterClick={false}
            >
              <Button tw="bg-neut-16!">取消</Button>
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
          {op !== 'edit' &&
            (!file ? (
              <Tooltip
                theme="light"
                animation="fade"
                placement="top-end"
                content={
                  <Center tw="h-9 px-3 text-neut-13">
                    请先添加符合要求的{packageTypeName}
                  </Center>
                }
              >
                <Button disabled tw="text-neut-8!">
                  上传
                </Button>
              </Tooltip>
            ) : (
              <Button
                type="primary"
                onClick={handleOk}
                loading={mutation.isLoading}
              >
                上传
              </Button>
            ))}
        </>
      }
    >
      <Alert
        type="info"
        tw="mb-4"
        message={`提示: ${packageTypeName}用于作业中的代码开发模式`}
        linkBtn={<Button type="text">查看详情 →</Button>}
      />
      <Form ref={form} tw="pl-0!">
        <TextFieldWrapper
          maxLength="128"
          autoComplete="off"
          name="resource_name"
          labelClassName="medium"
          placeholder={`请输入${packageTypeName}显示名`}
          label={<AffixLabel required>{packageTypeName}显示名</AffixLabel>}
          validateOnBlur
          schemas={[
            {
              rule: { required: true },
              help: '请输入程序包显示名',
              status: 'error',
            },
            {
              rule: { matchRegex: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/ },
              help: '只允许字母、数字或下划线（_）,不能以（_）开始结尾',
              status: 'error',
            },
          ]}
          disabled={op === 'view'}
          defaultValue={(op !== 'create' && defaultFields.name) || ''}
        />
        <TextAreaFieldWrapper
          name="description"
          labelClassName="medium"
          label="描述"
          placeholder={`请输入${packageTypeName}描述`}
          maxLength="1024"
          disabled={op === 'view'}
          defaultValue={(op !== 'create' && defaultFields.description) || ''}
        />
        {op !== 'edit' && (
          <Field tw="mb-0!">
            <Label className="medium">
              <AffixLabel required>添加{packageTypeName}</AffixLabel>
            </Label>
            <Control
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
                  添加{packageTypeName}
                </Button>
              ) : (
                <>
                  <Icon className="is-left" name="jar" />
                  &nbsp;
                  <InputWapper
                    value={`${file.name} (${(file.size / 1024 / 1024).toFixed(
                      2
                    )}MB)`}
                  />
                  <PopConfirm
                    type="warning"
                    okText="移除"
                    content={
                      <div tw="text-neut-16">
                        此时移除，将清空已上传资源，确定移除资源吗？
                      </div>
                    }
                    onOk={handleClear}
                    closeAfterClick={false}
                  >
                    <Icon className="is-right" name="close" clickable />
                  </PopConfirm>
                </>
              )}
            </Control>
          </Field>
        )}
        {op !== 'edit' && (
          <div tw="pl-28 ml-2 pb-3 pt-1 text-neut-8">
            仅支持 .jar 格式文件、大小不超过 100 MB、且仅支持单个上传
          </div>
        )}
      </Form>
    </DarkModal>
  )
})

export default UploadModal
