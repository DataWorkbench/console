import { useRef, useEffect, useState } from 'react'
import { Form, Icon } from '@QCFE/lego-ui'
import { Button, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import {
  FlexBox,
  AffixLabel,
  Tooltip,
  Modal,
  SelectWithRefresh,
} from 'components'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import {
  useQueryResource,
  useMutationStreamJobCode,
  useQueryStreamJobCode,
  useMutationReleaseStreamJob,
  useQueryStreamJobSchedule,
  getResourceKey,
} from 'hooks'
import { get, flatten } from 'lodash-es'
import StreamRightMenu from './StreamRightMenu'
import ReleaseModal from './ReleaseModal'
import { StreamToolBar } from './styled'
import UploadModal from '../Resource/UploadModal'

const { TextField } = Form

const StreamJAR = () => {
  const [enableRelease, setEnableRelease] = useState(false)
  const [show, toggleShow] = useState(false)
  const [uploadVisible, setUploadVisible] = useState(false)
  const [showScheModal, toggleScheModal] = useState(false)
  const [showScheSettingModal, setShowScheSettingModal] = useState(false)
  const queryClient = useQueryClient()
  const [params, setParams] = useImmer({
    jarArgs: '',
    jarEntry: '',
    resourceId: '',
  })
  const resouceRet = useQueryResource({
    resource_type: 1,
    limit: 100,
  })
  const { data: scheData } = useQueryStreamJobSchedule()
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
    if (get(data, 'jar.resource_id')) {
      setEnableRelease(true)
    }
  }, [data, scheData])
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
              content: '保存成功',
              placement: 'bottomRight',
            })
          },
        }
      )
    }
  }

  const handleRelease = () => {
    if (get(scheData, 'schedule_policy') === 0) {
      toggleScheModal(true)
    } else {
      toggleShow(true)
    }
  }
  return (
    <FlexBox tw="h-full flex-1">
      <FlexBox tw="flex-col flex-1 pl-5">
        <StreamToolBar tw="pl-0">
          <Button onClick={handleSave} loading={mutation.isLoading}>
            <Icon name="data" type="dark" />
            保存
          </Button>
          <Tooltip
            disabled={enableRelease}
            theme="light"
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
        </StreamToolBar>
        <div tw="mt-5 flex-1">
          <Form tw="w-96!" ref={form} layout="vertical">
            <SelectWithRefresh
              name="resource_id"
              label={<AffixLabel>引用 Jar 包（程序包）</AffixLabel>}
              placeholder="请选择要引用的 Jar 包（程序包）"
              help={
                <div tw="text-neut-8">
                  如需选择新的资源，可以在资源管理中
                  <span
                    tw="text-green-11 cursor-pointer"
                    onClick={() => {
                      setUploadVisible(true)
                    }}
                  >
                    上传资源
                  </span>
                </div>
              }
              valueRenderer={(option: any) => (
                <div tw="flex items-center space-x-1">
                  <Icon
                    name="coding"
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
              optionRenderer={(option: any) => (
                <div tw="flex items-center space-x-1">
                  <Icon
                    name="coding"
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
              onRefresh={() => {
                queryClient.invalidateQueries(getResourceKey('infinite'))
              }}
              bottomTextVisible
            />
            {/* <Button type="black">
                <Icon name="refresh" size={20} changeable />
              </Button> */}

            <TextField
              name="jar_entry"
              label="入口类（Entry Class）"
              autoComplete="off"
              placeholder="请输入入口类（Entry Class）"
              value={params.jarEntry}
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.jarEntry = v
                })
              }}
            />
            <TextField
              name="jar_args"
              label="程序参数（Program Arguments）"
              autoComplete="off"
              placeholder="请输入程序参数（Program Arguments）"
              value={params.jarArgs}
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.jarArgs = v
                })
              }}
            />
          </Form>
        </div>
        {show && <ReleaseModal onCancel={() => toggleShow(false)} />}
        {showScheModal && (
          <Modal
            visible
            noBorder
            width={400}
            onCancel={() => toggleScheModal(false)}
            okText="调度配置"
            onOk={() => {
              setShowScheSettingModal(true)
              toggleScheModal(false)
            }}
          >
            <div tw="flex">
              <Icon
                name="exclamation"
                color={{ secondary: '#F5C414' }}
                size={20}
              />
              <div tw="ml-3">
                <div tw="text-base">尚未配置调度任务</div>
                <div tw="mt-2 text-neut-8">
                  发布调度任务前，请先完成调度配置，否则无法发布
                </div>
              </div>
            </div>
          </Modal>
        )}
      </FlexBox>
      <StreamRightMenu
        showScheSetting={showScheSettingModal}
        onScheSettingClose={() => {
          setShowScheSettingModal(false)
        }}
      />

      {uploadVisible && (
        <UploadModal
          type="program"
          operation="create"
          visible={uploadVisible}
          handleCancel={() => setUploadVisible(false)}
          handleSuccess={() =>
            queryClient.invalidateQueries(getResourceKey('infinite'))
          }
        />
      )}
    </FlexBox>
  )
}

export default StreamJAR
