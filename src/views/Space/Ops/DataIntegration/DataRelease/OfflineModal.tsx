import { observer } from 'mobx-react-lite'
import { FlexBox } from 'components/Box'
import { Checkbox, Icon } from '@QCFE/lego-ui'
import React, { useRef } from 'react'
import tw, { css, styled } from 'twin.macro'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import { useQueryClient } from 'react-query'
import { getJobReleaseKey, useMutationJobRelease } from 'hooks/useJobRelease'
import { Modal } from 'components'

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-head {
      border-bottom: 0;
    }

    .modal-card-body {
      padding-top: 0;
    }

    .modal-card-foot {
      border-top: 0;
      ${tw`pb-4!`}
    }
  `
])

const OfflineModal = observer(({ refetch }: { refetch?: Function }) => {
  const checkRef = useRef(false)

  const mutation = useMutationJobRelease()

  const { showOffline, selectedData, set } = useDataReleaseStore()

  const queryClient = useQueryClient()
  const refetchData = () => {
    queryClient.invalidateQueries(getJobReleaseKey())
  }

  return (
    <>
      {showOffline && (
        <ModalWrapper
          visible
          width={400}
          appendToBody
          onCancel={() => {
            set({
              showOffline: false
            })
            checkRef.current = false
          }}
          okText="下线"
          okType="danger"
          onOk={() => {
            Promise.all([
              mutation.mutateAsync({
                op: 'offline',
                jobId: selectedData?.id,
                stop_running: checkRef.current
              })
              // mutation.mutateAsync({
              //   op: checkRef.current ? 'suspend' : '',
              //   jobId: selectedData?.id,
              // }),
            ]).then(() => {
              set({
                showOffline: false
              })
              checkRef.current = false
              if (refetch) {
                refetch()
              } else {
                refetchData()
              }
            })
          }}
        >
          <div>
            <FlexBox tw="gap-3">
              <Icon name="if-exclamation" size={24} tw="text-[24px] text-[#FFD127] leading-6" />
              <div tw="grid gap-2">
                <div tw="text-white text-[16px] leading-6">下线作业 {selectedData?.name}</div>
                <div tw="text-neut-8 leading-5">
                  作业下线后，相关实例需要手动恢复执行，确认从调度系统移除作业么?
                </div>
                <div tw="leading-5">
                  <Checkbox
                    onChange={(e, checked) => {
                      checkRef.current = checked
                    }}
                  >
                    <span tw="text-white ml-1">同时停止运行中的实例</span>
                  </Checkbox>
                </div>
              </div>
            </FlexBox>
          </div>
        </ModalWrapper>
      )}
    </>
  )
})
export default OfflineModal
