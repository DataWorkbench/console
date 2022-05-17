import tw, { css, styled } from 'twin.macro'
import { Card } from 'components/Card'
import { Button, Collapse, Icon } from '@QCFE/lego-ui'
import { FlexBox } from 'components/Box'
import { MoreAction } from 'components/MoreAction'
import { dataReleaseDetailActions } from 'views/Space/Ops/DataIntegration/constants'
import React, { useState } from 'react'
import { InstanceName } from 'components/InstanceName'
import NetworkList from './NetworkList'

const Root = styled.div`
  ${tw`grid p-5 gap-3`}
`

const { CollapsePanel } = Collapse

const GridItem = styled.div(({ labelWidth = 88 }: { labelWidth?: number }) => [
  css`
    & {
      ${tw`grid place-content-start gap-y-1`}
      grid-template-columns: ${labelWidth}px 1fr;

      & > span:nth-of-type(2n + 1) {
        ${tw`text-font-placeholder!`}
      }

      & > span:nth-of-type(2n) {
        ${tw`text-font!`}
      }
    }
  `,
])

const networkSettingKey = 'NETWORK_SETTING'
const Network = () => {
  const data = {}
  const [isOpen, setOpen] = useState(true)
  return (
    <Root>
      <Card hasBoxShadow tw="bg-bgColor">
        <div tw="flex justify-between items-center px-4 h-[72px]">
          <InstanceName
            theme="light"
            name={<div>vpc</div>}
            icon="vpc"
            iconSize="large"
            desc="vpc"
          />
          <FlexBox tw="gap-4">
            <MoreAction
              theme="auto"
              items={dataReleaseDetailActions
                // .filter(filterActionFn)
                .map((i) => ({
                  ...i,
                  value: data,
                }))}
              type="button"
              buttonText="更多操作"
              placement="bottom-start"
              // onMenuClick={handleAction}
            />

            <Button
              onClick={() => {
                setOpen(!isOpen)
              }}
              type="icon"
              tw=""
            >
              <Icon
                name={!isOpen ? 'chevron-down' : 'chevron-up'}
                type="dark"
                tw="bg-transparent! hover:bg-transparent!"
                size={16}
              />
            </Button>
          </FlexBox>
        </div>

        <CollapsePanel visible={isOpen} tw="bg-transparent">
          <div tw="flex-auto grid grid-cols-3 border-t border-separator py-3">
            <GridItem>
              <span>IPv4 地址范围：</span>
              <span>192.168.0.1/16</span>
              <span>公网 IPv4：</span>
              <span />
            </GridItem>

            <GridItem>
              <span>IPv6 地址范围：</span>
              <span>192.168.0.1/16</span>
              <span>内网 IP：</span>
              <span />
            </GridItem>

            <GridItem labelWidth={84}>
              <span>类型</span>
              <span>小型</span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>

      <Card tw="p-5">
        <NetworkList settingKey={networkSettingKey} />
      </Card>
    </Root>
  )
}

export default Network
