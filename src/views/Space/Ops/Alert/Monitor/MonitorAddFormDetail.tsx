import { FlexBox, Icons, Modal, ModalContent } from 'components/index'
import tw, { styled } from 'twin.macro'
import { UserItem } from 'views/Space/Ops/Alert/Monitor/components'
import { observer } from 'mobx-react-lite'
import { useAlertStore } from 'views/Space/Ops/Alert/AlertStore'
import { monitorObjectTypes } from 'views/Space/Ops/Alert/common/constants'
import { JobItem, Tag } from './styles'

interface IMonitorAddProps {
  onCancel: () => void
  data: Record<string, any>
}

const FieldItem = styled.div`
  & {
    ${tw`flex gap-3`}
    &:not(:last-child) {
      ${tw`mb-2 `}
    }
    & > div:first-child {
      ${tw`w-20 label-required flex-none`}
    }
    & > div:last-child {
      ${tw`flex-auto flex-wrap`}
    }
  }
`

const MonitorAddFormDetail = observer((props: IMonitorAddProps) => {
  const { onCancel } = props
  const { selectedMonitor: data } = useAlertStore()
  const monitorItem =
    data?.monitor_object === 1
      ? data?.monitor_item?.stream_job
      : data?.monitor_item?.sync_job

  return (
    <Modal
      visible
      width={800}
      orient="fullright"
      onOk={onCancel}
      onCancel={onCancel}
      title="告警策略详情"
      appendToBody
    >
      <ModalContent>
        <FieldItem>
          <div>名称</div>
          <div>{data?.name}</div>
        </FieldItem>
        <FieldItem>
          <div>监控对象</div>
          <div>{monitorObjectTypes[data?.monitor_object as 1]?.label}</div>
        </FieldItem>
        <FieldItem>
          <div>监控项</div>
          <div>
            {monitorItem?.instance_run_failed && <div>作业失败时告警</div>}
            {monitorItem?.instance_run_timeout && (
              <div>
                <span tw="mr-2">作业实例运行超时时间</span>
                <Tag>{`${monitorItem?.instance_timeout} 秒`}</Tag>
              </div>
            )}
          </div>
        </FieldItem>
        <FieldItem>
          <div>触发规则</div>
          <div>触发任意一项监控</div>
        </FieldItem>
        <FieldItem>
          <div>触发行为</div>
          <div>发送通知</div>
        </FieldItem>
        <FieldItem>
          <div>绑定作业</div>
          <FlexBox tw="gap-1">
            {(data?.job_ids ?? []).map((v, k) => (
              <JobItem key={k.toString()}>
                <Icons
                  tw="text-green-11"
                  name={
                    data?.monitor_object === 1 ? 'DownloadBoxFill' : 'LayerFill'
                  }
                  size={16}
                />
                <div>
                  <span>{`ID:${v}`}</span>
                </div>
              </JobItem>
            ))}
          </FlexBox>
        </FieldItem>
        <FieldItem>
          <div>消息接收人</div>
          <FlexBox tw="flex-wrap gap-1">
            {(data?.notifications ?? []).map((v) => (
              <UserItem {...v} key={v.id} />
            ))}
          </FlexBox>
        </FieldItem>
        <FieldItem>
          <div>策略描述</div>
          <div>{data?.desc}</div>
        </FieldItem>
      </ModalContent>
    </Modal>
  )
})

export default MonitorAddFormDetail
