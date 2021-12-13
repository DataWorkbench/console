import { useRef, useEffect, useState } from 'react'
import { Form, Icon } from '@QCFE/lego-ui'
import { Button, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, AffixLabel, Tooltip } from 'components'
import { useImmer } from 'use-immer'
import {
  useQueryResource,
  useMutationStreamJobCode,
  useQueryStreamJobCode,
  useMutationReleaseStreamJob,
} from 'hooks'
import { get, flatten } from 'lodash-es'
import { Link, useParams } from 'react-router-dom'
import ReleaseModal from './ReleaseModal'

const { TextField, SelectField } = Form

const StreamJAR = () => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const [enableRelease, setEnableRelease] = useState(false)
  const [show, toggleShow] = useState(false)
  const [params, setParams] = useImmer({
    jarArgs: '',
    jarEntry: '',
    resourceId: '',
  })
  const resouceRet = useQueryResource({})
  const { data } = useQueryStreamJobCode()
  const mutation = useMutationStreamJobCode()
  const releaseMutation = useMutationReleaseStreamJob()
  useEffect(() => {
    const jarInfo = get(data, 'jar')
    if (jarInfo) {
      setParams((draft) => {
        draft.jarArgs = jarInfo.jar_args
        draft.jarEntry = jarInfo.jar_entry
        draft.resourceId = jarInfo.resource_id
      })
    }
  }, [data, setParams])
  useEffect(() => {
    if (data) {
      setEnableRelease(true)
    }
  }, [data])
  const resources = flatten(
    resouceRet.data?.pages.map((page: Record<string, any>) => page.infos || [])
  )
  const form = useRef()
  const handleSave = () => {
    const formEl: any = form.current
    if (formEl.validateFields()) {
      const jarData = formEl.getFieldsValue()
      mutation.mutate(
        {
          jar: jarData,
          type: 3,
        },
        {
          onSuccess: () => {
            setEnableRelease(true)
            Notify.success({
              title: '操作提示',
              content: '代码保存成功',
              placement: 'bottomRight',
            })
          },
        }
      )
    }
  }

  const handleRelease = () => {
    toggleShow(true)
  }
  return (
    <div tw="pl-5">
      <FlexBox tw="pt-4 space-x-2">
        <Button onClick={handleSave} loading={mutation.isLoading}>
          <Icon name="data" type="dark" />
          保存
        </Button>
        <Tooltip
          disabled={enableRelease}
          theme="light"
          placement="bottom"
          hasPadding
          content="请添加Jar包后发布"
        >
          <Button
            type="primary"
            onClick={handleRelease}
            loading={releaseMutation.isLoading}
            disabled={!enableRelease}
          >
            <Icon name="export" />
            发布
          </Button>
        </Tooltip>
      </FlexBox>
      <Form tw="mt-5 w-96!" ref={form} layout="vertical">
        <SelectField
          name="resource_id"
          label={<AffixLabel>引用 Jar 包（程序包）</AffixLabel>}
          placeholder="请选择要引用的 Jar 包（程序包）"
          help={
            <>
              如需选择新的资源，可以在资源管理中
              <Link
                to={`/${regionId}/workspace/${spaceId}/dm/resource`}
                tw="text-white underline text-underline-offset[2px]"
              >
                上传资源
              </Link>
            </>
          }
          optionRenderer={(option) => (
            <div tw="flex items-center space-x-1">
              <Icon
                name={option.type === 1 ? 'coding' : 'terminal'}
                type="light"
                color={{
                  primary: '#219861',
                  secondary: '#8EDABD',
                }}
              />
              <span>{option.label}</span>
              <span tw="text-neut-8">ID: {option.value}</span>
            </div>
          )}
          value={params.resourceId}
          options={resources.map((res) => ({
            label: res.name,
            value: res.resource_id,
            type: res.type,
          }))}
          schemas={[
            {
              rule: { required: true },
              help: '请选择要引用的 Jar 包资源',
              status: 'error',
            },
          ]}
          isLoading={resouceRet.isFetching}
          isLoadingAtBottom
          searchable={false}
          onMenuScrollToBottom={() => {
            if (resouceRet.hasNextPage) {
              resouceRet.fetchNextPage()
            }
          }}
          onChange={(v: string) => {
            setParams((draft) => {
              draft.resourceId = v
            })
          }}
          bottomTextVisible
        />
        <TextField
          name="jar_entry"
          label="运行函数入口"
          placeholder="请输入运行函数入口"
          value={params.jarEntry}
          onChange={(v: string) => {
            setParams((draft) => {
              draft.jarEntry = v
            })
          }}
        />
        <TextField
          name="jar_args"
          label="运行参数"
          placeholder="请输入运行参数"
          value={params.jarArgs}
          onChange={(v: string) => {
            setParams((draft) => {
              draft.jarArgs = v
            })
          }}
        />
      </Form>
      {show && <ReleaseModal onCancel={() => toggleShow(false)} />}
    </div>
  )
}

export default StreamJAR
