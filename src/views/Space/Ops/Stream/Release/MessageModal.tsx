import { DarkModal, FlexBox, TextLink } from 'components'
import { Collapse, Icon } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
import dayjs from 'dayjs'
import { InstanceState } from '../constants'

const { CollapseItem } = Collapse

const CollapseWrap = styled(Collapse)(() => [
  css`
    .collapse-item {
      ${tw`mb-1`}
    }
    .collapse-item-label {
      ${tw`relative border-0! bg-neut-13! rounded!`}

      &:before {
        ${tw`content-[''] block w-1 h-4 absolute left-0 bg-green-11 top-1/2 -translate-y-1/2`}
      }
    }
    .collapse-item-content {
      ${tw`p-0 rounded-b`}
    }
  `,
])

export default function MessageModal({ visible, cancel, row = {} }: any) {
  return (
    <DarkModal
      orient="fullright"
      width={800}
      title={`${row.id} 实例详情`}
      visible={visible}
      onCancel={cancel}
      footer={<div tw="h-8" />}
    >
      <CollapseWrap tw="px-5 pt-3" defaultActiveKey={['p1', 'p2']}>
        <CollapseItem key="p1" label="基本信息">
          <FlexBox tw="py-3">
            <div tw="w-80">
              <div tw="flex mb-1">
                <span tw="text-neut-8 w-[60px] mr-2">ID: </span>
                <span>{row.id}</span>
              </div>
              <div tw="flex mb-1">
                <span tw="text-neut-8 w-[60px] mr-2">状态: </span>
                <div tw="flex items-center">
                  <Icon
                    tw="mr-2"
                    name="radio"
                    color={InstanceState[row.state]?.color}
                  />
                  {InstanceState[row.state]?.name}
                </div>
              </div>
              <div tw="flex">
                <span tw="text-neut-8 w-14 mr-3">所属作业: </span>
                <span>{row.job_id}</span>
              </div>
            </div>
            <div>
              <div tw="mb-1">
                <span tw="text-neut-8 w-14 mr-3">开始时间: </span>
                <span>
                  {dayjs(row.created * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>

              <div tw="mb-1">
                <span tw="text-neut-8 w-14 mr-3">更新时间: </span>
                <span>
                  {dayjs(row.updated * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>

              <div>
                <span tw="text-neut-8 w-14 mr-3">其他信息:</span>
                <TextLink
                  href={`//${row.id}.flink.databench.io`}
                  target="_blank"
                >
                  Flink UI
                </TextLink>
              </div>
            </div>
          </FlexBox>
        </CollapseItem>
        <CollapseItem key="p2" label="message">
          <div tw="px-5 py-3 bg-neut-17 max-h-[668px] overflow-y-scroll">
            <div>{row.message}</div>
          </div>
        </CollapseItem>
      </CollapseWrap>
    </DarkModal>
  )
}
