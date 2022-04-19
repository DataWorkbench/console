import { FlexBox, Icons, Modal, ModalContent } from 'components/index'
import tw, { styled } from 'twin.macro'
import { UserItem } from 'views/Space/Ops/Alert/Monitor/components'
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

const MonitorAddFormDetail = (props: IMonitorAddProps) => {
  const {
    onCancel,
    // eslint-disable-next-line no-empty-pattern
    data: {},
  } = props
  return (
    <Modal
      visible
      width={800}
      orient="fullright"
      onOk={onCancel}
      onCancel={onCancel}
      title="创建告警策略"
      appendToBody
    >
      <ModalContent>
        <FieldItem>
          <div>名称</div>
          <div>2444</div>
        </FieldItem>
        <FieldItem>
          <div>监控对象</div>
          <div>46666</div>
        </FieldItem>
        <FieldItem>
          <div>监控项</div>
          <div>
            <div>作业失败时告警</div>
            <div>
              <span tw="mr-2">作业实例运行超时时间</span>
              <Tag>3600</Tag>
            </div>
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
            {Array.from({ length: 10 }, (v, k) => k).map((v, k) => (
              <JobItem key={k.toString()}>
                <Icons
                  tw="text-green-11"
                  name={k % 2 ? 'DownloadBoxFill' : 'LayerFill'}
                  size={16}
                />
                <div>
                  <span>Abstract</span>
                  <span>ID:hahaha</span>
                </div>
              </JobItem>
            ))}
          </FlexBox>
        </FieldItem>
        <FieldItem>
          <div>消息接收人</div>
          <FlexBox tw="flex-wrap gap-1">
            {Array.from({ length: 20 }, (v, k) => k).map((v, k) => (
              <UserItem name={Math.random().toString(32)} key={k.toString()} />
            ))}
          </FlexBox>
        </FieldItem>
        <FieldItem>
          <div>策略描述</div>
          <div>很长很长</div>
        </FieldItem>
      </ModalContent>
    </Modal>
  )
}

export default MonitorAddFormDetail
