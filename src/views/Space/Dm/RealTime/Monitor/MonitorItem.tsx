import { Icon } from '@QCFE/qingcloud-portal-ui'

import { Center, FlexBox, Tooltip } from 'components'
import tw, { styled } from 'twin.macro'

interface IMonitorItemProps {}

const itemStyle = {
  itemText: tw`text-xs text-neut-8`,
}

const Line = styled.div`
  ${tw`w-full h-[1px] bg-neut-15 mt-2 mb-2`}
`
const Tag = styled.div`
  ${tw`inline-flex items-center leading-4! text-xs h-4 rounded-[8px] px-3 bg-neut-13 text-white`}
`

const MonitorItem = (props: IMonitorItemProps) => {
  return (
    <div>
      <FlexBox tw="items-center">
        <Icon
          name="if-security-strategy"
          type="light"
          size={16}
          tw="text-[16px]"
        />
        <span tw="text-xs ml-2.5 text-white">监控项</span>
      </FlexBox>
      <Line />
      <FlexBox tw="gap-2">
        <span css={itemStyle.itemText}>作业实例失败数</span>
        <Tag> ≥ </Tag>
        <Tag> 0 </Tag>
      </FlexBox>
      <FlexBox tw="gap-2 mt-3">
        <span css={itemStyle.itemText}>作业实例运行时超时告警</span>
        <Tag> ≥ </Tag>
        <Tag> 3600 秒 </Tag>
      </FlexBox>
      <FlexBox tw="items-center mt-5">
        {/* //TODO 图标未找到 */}
        <Icon name="security-policy" type="light" size={16} tw="text-[16px]" />
        <span tw="text-xs ml-2.5 text-white">触发规则</span>
      </FlexBox>
      <Line />
      <div>
        <span css={itemStyle.itemText}>监控项满足其一即触发通知</span>
      </div>
      <FlexBox tw="items-center mt-5">
        <Icon name="mail" type="light" size={16} tw="text-[16px]" />
        <span tw="text-xs ml-2.5 text-white">消息接受人</span>
      </FlexBox>
      <Line />
      <FlexBox tw="gap-2">
        <Tooltip
          hasPadding
          theme="light"
          content={
            <div tw="text-xs text-neut-13">
              <div>
                <span>手机：</span>
                <span>13800138000</span>
              </div>
              <div>
                <span>邮箱：</span>
                <span>abc@qq.com</span>
              </div>
              <div>
                <span>微信：</span>
                <span>abc</span>
              </div>
              <div>
                <span>webhook：</span>
                <span>123456789</span>
              </div>
            </div>
          }
        >
          <Tag>crystal</Tag>
        </Tooltip>
      </FlexBox>
    </div>
  )
}

export default MonitorItem
