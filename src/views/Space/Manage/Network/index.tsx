import tw, { css, styled, theme } from 'twin.macro'
import {
  Card,
  Center,
  Tooltip,
  InstanceName,
  FlexBox,
  MoreAction,
} from 'components'
import { Button, Collapse, Icon } from '@QCFE/lego-ui'
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'stores/index'
import { useParams } from 'react-router-dom'
import { isDarkTheme } from 'utils/theme'
import NetworkModal from './NetworkModal'
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
const Network = observer(() => {
  const {
    globalStore: { curRegionInfo },
  } = useStore()
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  // const data = {}
  const [isOpen, setOpen] = useState(true)
  const [showModal, setShowModal] = useState(true)
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
              items={[
                { key: 'update', text: '更换 VPC', icon: 'changing-over' },
                {
                  key: 'close',
                  text: (
                    <Center>
                      <span tw="mr-1.5">解绑 VPC</span>
                      <Tooltip
                        hasPadding
                        content="删除工作空间即可解绑 VPC"
                        theme="instead"
                      >
                        <Icon
                          name="information"
                          css={css`
                            svg.qicon {
                              fill: ${
                                isDarkTheme()
                                  ? theme('colors.icon.single.white')
                                  : theme('colors.icon.single.dark')
                              };
                              ${tw`text-icon-single-white! dark:text-icon-single-dark!`}
                            }
                          }
                          `}
                          type={isDarkTheme() ? 'light' : 'dark'}
                        />
                      </Tooltip>
                    </Center>
                  ),
                  icon: 'close',
                  disabled: true,
                },
              ]}
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
      {showModal && (
        <NetworkModal
          regionId={regionId}
          spaceId={spaceId}
          regionName={(curRegionInfo! as Record<string, any>)?.name as string}
          vpcId=""
          xnetId=""
          onClose={() => {
            setShowModal(false)
          }}
        />
      )}
    </Root>
  )
})

export default Network
