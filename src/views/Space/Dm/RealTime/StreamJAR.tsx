import { useRef, useEffect, useState } from 'react'
import { Form, Icon } from '@QCFE/lego-ui'
import { Button, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import {
  FlexBox,
  AffixLabel,
  Tooltip,
  TextLink,
  Modal,
  SelectWithRefresh,
} from 'components'
import { useImmer } from 'use-immer'
import { useUnmount } from 'react-use'
import { useQueryClient } from 'react-query'
import {
  useQueryResource,
  useMutationStreamJobCode,
  useQueryStreamJobCode,
  useMutationReleaseStreamJob,
  useQueryStreamJobSchedule,
  getResourceKey,
  useStore,
} from 'hooks'
import { strlen } from 'utils/convert'
import { get, flatten } from 'lodash-es'
import { css } from 'twin.macro'
import StreamRightMenu from './StreamRightMenu'
import ReleaseModal from './ReleaseModal'
import { StreamToolBar } from './styled'
import UploadModal from '../Resource/UploadModal'

const { TextField } = Form

const StreamJAR = () => {
  const { workFlowStore } = useStore()
  const [enableRelease, setEnableRelease] = useState(false)
  const [show, toggleShow] = useState(false)
  const [uploadVisible, setUploadVisible] = useState(false)
  const [showScheModal, toggleScheModal] = useState(false)
  const [showScheSettingModal, setShowScheSettingModal] = useState(false)
  const queryClient = useQueryClient()
  const [params, setParams] = useImmer({
    jarArgs: '',
    jarEntry: '',
    fileId: '',
  })
  const resouceRet = useQueryResource({
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
        draft.fileId = jarInfo.file_id
      })
    }
  }, [data, setParams])
  useEffect(() => {
    if (get(data, 'jar.file_id')) {
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
              title: '????????????',
              content: '????????????',
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

  useUnmount(() => {
    workFlowStore.set({
      showNotify: false,
    })
  })

  const handleReleaseSuccess = () => {
    toggleShow(false)
    workFlowStore.set({
      showNotify: true,
    })
  }

  return (
    <FlexBox tw="h-full flex-1">
      <FlexBox tw="flex-col flex-1 pl-5">
        <StreamToolBar tw="pl-0">
          <Button
            tw="w-[68px] px-0"
            onClick={handleSave}
            loading={mutation.isLoading}
          >
            <Icon name="data" type="dark" />
            ??????
          </Button>
          <Tooltip
            disabled={enableRelease}
            theme="light"
            hasPadding
            content="?????????Jar????????????"
          >
            <Button
              type="primary"
              tw="w-[68px] px-0"
              onClick={handleRelease}
              loading={releaseMutation.isLoading}
              disabled={!enableRelease}
            >
              <Icon name="export" />
              ??????
            </Button>
          </Tooltip>
        </StreamToolBar>
        <div tw="mt-5 flex-1">
          <Form tw="w-[600px]! max-w-[600px]!" ref={form} layout="vertical">
            <SelectWithRefresh
              name="file_id"
              css={css`
                .select {
                  width: 555px;
                }
              `}
              label={<AffixLabel>JAR ???????????????</AffixLabel>}
              placeholder="????????? JAR ?????????"
              help={
                <div tw="text-neut-8">
                  ???????????????????????????????????????????????????
                  <TextLink
                    tw="text-white! ml-1"
                    hasIcon={false}
                    onClick={() => {
                      setUploadVisible(true)
                    }}
                  >
                    ????????????
                  </TextLink>
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
              value={params.fileId}
              options={resources.map((res) => ({
                label: res.name,
                value: res.id,
                type: res.type,
              }))}
              schemas={[
                {
                  rule: { required: true },
                  help: '????????????????????? Jar ?????????',
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
                  draft.fileId = v
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
              label="????????????Entry Class???"
              autoComplete="off"
              placeholder="?????????????????????Entry Class???"
              value={params.jarEntry}
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.jarEntry = v
                })
              }}
              schemas={[
                {
                  rule: (value: string) => {
                    return strlen(value) <= 1024
                  },
                  help: '??????????????????1024??????',
                  status: 'error',
                },
              ]}
            />
            <TextField
              name="jar_args"
              label="???????????????Program Arguments???"
              autoComplete="off"
              placeholder="????????????????????????Program Arguments???"
              value={params.jarArgs}
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.jarArgs = v
                })
              }}
              schemas={[
                {
                  rule: (value: string) => {
                    return strlen(value) <= 1024
                  },
                  help: '??????????????????1024??????',
                  status: 'error',
                },
              ]}
            />
          </Form>
        </div>
        {show && (
          <ReleaseModal
            onSuccess={handleReleaseSuccess}
            onCancel={() => toggleShow(false)}
          />
        )}
        {showScheModal && (
          <Modal
            visible
            noBorder
            width={400}
            onCancel={() => toggleScheModal(false)}
            okText="????????????"
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
                <div tw="text-base">????????????????????????</div>
                <div tw="mt-2 text-neut-8">
                  ?????????????????????????????????????????????????????????????????????
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
