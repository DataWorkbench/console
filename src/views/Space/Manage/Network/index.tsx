import tw, { css, styled, theme } from 'twin.macro'
import {
  Card,
  Center,
  Tooltip,
  InstanceName,
  FlexBox,
  MoreAction,
  StatusBar,
  Modal,
} from 'components'
import { Button, Collapse } from '@QCFE/lego-ui'
import { Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'stores/index'
import { useParams } from 'react-router-dom'
import { isDarkTheme } from 'utils/theme'
import { networkStatusMap } from 'views/Space/Manage/Network/common/constants'
import Link from 'components/Link'
import NetworkModal from './NetworkModal'
import NetworkList from './NetworkList'
import {
  useQueryDescribeNetworkConfig,
  useQueryFlinkClusters,
} from '../../../../hooks'

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

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-head {
      border-bottom: 0;
    }

    .modal-card-body {
      padding-top: 0;
      padding-bottom: 80px;
    }

    .modal-card-foot {
      border-top: 0;
    }
  `,
])

const routerType = [
  {
    label: '小型',
    value: 1,
  },
  {
    label: '中型',
    value: 0,
  },
  {
    label: '大型',
    value: 2,
  },
  {
    label: '超大型',
    value: 3,
  },
  {
    label: '免费',
    value: 99,
  },
]
const nameStyle = css`
  &:hover {
    .instance-name-title span {
      ${tw`text-green-11!`}
    }
    .instance-name-icon {
      ${tw`bg-[#ECFDF5] `}
      .icon svg.qicon {
        ${tw`text-green-11! fill-[#9DDFC9]!`}
      }
    }
  }
`
const networkSettingKey = 'NETWORK_SETTING'
const Network = observer(() => {
  const {
    globalStore: { curRegionInfo },
  } = useStore()
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const { data, isFetching } = useQueryDescribeNetworkConfig({
    uri: { space_id: spaceId },
  })
  const [isOpen, setOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const { data: clusters } = useQueryFlinkClusters({})
  const hasClusters = clusters && clusters.infos && clusters.infos.length > 0

  const handleAction = (_: object, key: 'update' | 'close') => {
    switch (key) {
      case 'update':
        setShowModal(true)
        break
      default:
        break
    }
  }

  return (
    <Root>
      <Card hasBoxShadow tw="bg-bgColor relative">
        {isFetching && <Loading size="large" tw="absolute" />}
        <div tw="flex justify-between items-center px-4 h-[72px]">
          <InstanceName
            css={nameStyle}
            theme="light"
            name={
              <Center
                tw="inline-flex gap-3 hover:cursor-pointer"
                onClick={() => {
                  window.open(
                    `/${regionId}/routers/${data?.router?.router_id}`,
                    '_blank'
                  )
                }}
              >
                <span tw="text-[#334155] leading-5 font-semibold">
                  {data?.router?.router_name}
                </span>
                <StatusBar
                  type={networkStatusMap.get(data?.router?.status)?.style}
                  label={networkStatusMap.get(data?.router?.status)?.label}
                />
              </Center>
            }
            icon="vpc"
            iconSize="large"
            desc={data?.router?.router_id}
          />
          <FlexBox tw="gap-4">
            <MoreAction<'update' | 'close'>
              theme="auto"
              items={[
                {
                  key: 'update',
                  text: (
                    <Center>
                      <span tw="mr-1.5">更换 VPC</span>
                      <Tooltip
                        hasPadding
                        content="暂未开放更换 VPC 功能"
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
                  disabled: true,
                  icon: 'changing-over',
                },
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
              onMenuClick={handleAction}
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
              <span>{data?.router?.vpc_network}</span>
              <span>公网 IPv4：</span>
              <span>{data?.router?.eip?.eip_addr} </span>
            </GridItem>

            <GridItem>
              <span>IPv6 地址范围：</span>
              <span>{data?.router?.vpc_ipv6_network}</span>
              <span>内网 IP：</span>
              <span>{data?.router?.private_ip}</span>
            </GridItem>

            <GridItem labelWidth={84}>
              <span>类型</span>
              <span>
                {
                  routerType.find((i) => i.value === data?.router?.router_type)
                    ?.label
                }
              </span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>

      <Card tw="p-5">
        <NetworkList
          settingKey={networkSettingKey}
          datasource={data?.vxnets ?? []}
        />
      </Card>
      {showModal && !hasClusters && (
        <NetworkModal
          regionId={regionId}
          spaceId={spaceId}
          regionName={(curRegionInfo! as Record<string, any>)?.name as string}
          vpcId={data?.router?.router_id!}
          xnetId={data?.default_vxnet_id!}
          onClose={() => {
            setShowModal(false)
          }}
        />
      )}
      {showModal && hasClusters && (
        <ModalWrapper
          visible
          width={400}
          onCancel={() => {
            setShowModal(false)
          }}
          footer={null}
          title={undefined}
        >
          <div tw="flex items-start">
            <Icon
              name="if-error-info"
              size="medium"
              css={[tw`mr-3 text-2xl leading-6`, tw`text-red-10`]}
            />
            <div tw="font-bold leading-6">
              更换 ${data?.router?.router_name} (${data?.router?.router_id}）
            </div>
          </div>

          <div tw="ml-9">
            <span tw="text-font-secondary mr-1">
              更换 VPC ，需先删除此工作空间的所有计算集群，可前往
            </span>
            <Link
              href={`/${regionId}/workspace/${spaceId}/dm/cluster`}
              // target="_blank"
              hasIcon={false}
            >
              计算集群
            </Link>
          </div>
        </ModalWrapper>
      )}
    </Root>
  )
})

export default Network
