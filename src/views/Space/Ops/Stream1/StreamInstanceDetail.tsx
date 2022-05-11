import { FlexBox } from 'components/Box'
import { Tooltip } from 'components/Tooltip'
import tw, { css, styled } from 'twin.macro'
import { Button, Collapse, Icon, Loading, Tabs } from '@QCFE/lego-ui'
import { Card } from 'components/Card'
import { Center } from 'components/Center'
import {
  AlarmStatusCmp,
  Circle,
  JobInstanceStatusCmp,
} from 'views/Space/Ops/styledComponents'
import dayjs from 'dayjs'
import DevContent from 'views/Space/Ops/components/DevContent'
import Cluster from 'views/Space/Ops/components/Cluster'
import Schedule from 'views/Space/Ops/components/Schedule'
import AlertModal from 'views/Space/Ops/Alert/Modal'
import OfflineModal from 'views/Space/Ops/DataIntegration/DataRelease/OfflineModal'
import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'
import { HorizonTabs } from 'views/Space/Dm/styled'

// @ts-ignore
import { CopyText } from '@QCFE/qingcloud-portal-ui'
import { AlertContext, AlertStore } from 'views/Space/Ops/Alert/AlertStore'
import { TextLink } from 'components/Link'
import { useQueryStreamInstanceDetail } from 'hooks'

const { TabPanel } = Tabs as any

const { CollapsePanel } = Collapse

const GridItem = styled.div(({ labelWidth = 60 }: { labelWidth?: number }) => [
  css`
    & {
      ${tw`grid place-content-start gap-y-1`}
      grid-template-columns: ${labelWidth}px 1fr;

      & > span:nth-of-type(2n + 1) {
        ${tw`text-neut-8!`}
      }

      & > span:nth-of-type(2n) {
        ${tw`text-white!`}
      }
    }
  `,
])

const Root = styled.div`
  ${tw`grid gap-3 h-full px-4 py-3 leading-[20px]`}
  grid-template-rows: auto auto 1fr;

  & {
    & .tabs {
      ${tw`flex-none`}
    }

    & .tab-content {
      ${tw`overflow-y-auto px-0 py-4 flex-auto`}
    }

    & .tab-panel.is-active {
      ${tw`h-full`}
    }
  }
`

const CopyTextWrapper = styled(CopyText)`
  & {
    & .text-field {
      ${tw`text-neut-8!`}
    }

    .popper.tooltip {
      ${tw`bg-white`}
      .tooltip-content {
        ${tw`text-neut-15`}
      }

      .tooltip-arrow {
        ${tw`border-b-white`}
      }
    }
  }

  &:hover {
    & .text-field {
      ${tw`text-white!`}
    }
  }
`

const StreamInstanceDetail = ({ id }: { id: string }) => {
  const { data, isFetching } = useQueryStreamInstanceDetail(id)

  const history = useHistory()
  const { search } = useLocation()
  const { tab = 'link' } = qs.parse(search.slice(1))

  const [isOpen, setOpen] = useState(true)

  const [activeName, setActiveName] = useState(tab)
  // const config = {}
  const toList = () => {
    history.push('../release')
  }

  return (
    <Root tw="relative">
      <FlexBox tw="items-center gap-2">
        <Tooltip
          theme="light"
          content="返回"
          hasPadding
          placement="bottom"
          twChild={tw`inline-flex`}
        >
          <div
            tw="inline-flex items-center justify-center w-6 h-6 rounded-full"
            onClick={() => toList()}
            css={css`
              &:hover {
                ${tw`bg-white cursor-pointer`}
                .icon svg.qicon {
                  ${tw`text-neut-15!`}
                }
            `}
          >
            <Icon
              name="previous"
              size={20}
              // clickable
              type="light"
              css={css`
                svg.qicon {
                  ${tw`text-[#939EA9]! fill-[#939EA9]!`}
                }
              `}
            />
          </div>
        </Tooltip>
        <CopyTextWrapper
          text={`${data?.name ?? ''}(ID: ${id})`}
          theme="light"
        />
      </FlexBox>

      <Card hasBoxShadow tw="bg-neut-16 relative">
        {isFetching && (
          <div tw="absolute inset-0 z-50">
            <Loading size="large" />
          </div>
        )}
        <div tw="flex justify-between items-center px-4 h-[72px]">
          <Center tw="flex-auto">
            <Circle>
              <Icon
                name="q-downloadBoxFill"
                type="light"
                css={css`
                  & .qicon {
                    ${tw`text-white! fill-[#fff]!`}
                  }
                `}
              />
            </Circle>
            <div tw="flex-auto">
              <div tw="text-white">
                <span tw="mr-3">{data?.name}</span>
                <JobInstanceStatusCmp
                  type={data?.status as 1}
                  tw="inline-flex"
                />
              </div>
              <div tw="text-neut-8">{data?.id}</div>
            </div>
          </Center>
          <FlexBox tw="gap-4">
            {/* <MoreAction */}
            {/*   items={dataReleaseDetailActions */}
            {/*     .filter(filterActionFn) */}
            {/*     .map((i) => ({ */}
            {/*       ...i, */}
            {/*       value: data, */}
            {/*     }))} */}
            {/*   type="button" */}
            {/*   buttonText="更多操作" */}
            {/*   placement="bottom-start" */}
            {/*   onMenuClick={handleAction} */}
            {/* /> */}

            <Button
              onClick={() => {
                setOpen(!isOpen)
              }}
              type="icon"
              tw="bg-transparent border dark:border-line-dark! focus:bg-line-dark! active:bg-line-dark! hover:bg-line-dark!"
            >
              <Icon
                name={!isOpen ? 'chevron-down' : 'chevron-up'}
                type="light"
                tw="bg-transparent! hover:bg-transparent!"
                size={16}
              />
            </Button>
          </FlexBox>
        </div>

        <CollapsePanel visible={isOpen} tw="bg-transparent">
          <div tw="flex-auto grid grid-cols-3 border-t border-neut-15 py-3">
            <GridItem>
              <span>告警状态:</span>
              <span>
                <AlarmStatusCmp type={data?.alert_status} />
              </span>
              <span>所属作业:</span>
              <span tw="inline-block">
                <Tooltip
                  theme="light"
                  hasPadding
                  content={`发布描述：${data?.desc}`}
                >
                  <div>
                    <div>
                      <span tw="text-white font-semibold mr-1">
                        {data?.job_name}
                      </span>
                      <span tw="text-neut-8">({data?.job_id})</span>
                    </div>
                    <div tw="text-neut-8">版本 ID: {data?.version}</div>
                  </div>
                </Tooltip>
              </span>
            </GridItem>
            <GridItem>
              <span>作业类型:</span>
              <span>
                {
                  // TODO: 作业模式字段
                  ''
                }
              </span>
              <span>其他信息:</span>
              <span>
                <TextLink
                  onClick={() => {
                    // TODO:
                  }}
                >
                  Flink UI
                </TextLink>
              </span>
            </GridItem>
            <GridItem labelWidth={84}>
              <span>开始时间:</span>
              <span>{dayjs(data?.created).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>更新时间:</span>
              <span>{dayjs(data?.updated).format('YYYY-MM-DD HH:mm:ss')}</span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>

      <HorizonTabs
        defaultActiveName=""
        tw="overflow-hidden bg-transparent flex-auto"
        // @ts-ignore
        activeName={activeName}
        onChange={(activeName1: string) => {
          setActiveName(activeName1)
        }}
      >
        <TabPanel label="Message" name="message">
          <div
            css={css`
              overflow-wrap: anywhere;
            `}
            tw="whitespace-pre-wrap bg-transparent"
          >
            {data?.message}
          </div>
        </TabPanel>
        <TabPanel label="监控告警" name="alarm">
          {/* <Monitor /> */}
        </TabPanel>
        <TabPanel label="开发内容" name="dev">
          <DevContent
            data={
              {
                // TODO: config
              }
            }
            curJob={data}
          />
        </TabPanel>
        <TabPanel label="计算集群" name="cluster">
          <Cluster
            clusterId={
              undefined
              // TODO: config id
            }
          />
        </TabPanel>
        <TabPanel label="调度信息" name="schedule">
          <Schedule
            data={
              {
                // TODO: value
              }
            }
          />
        </TabPanel>
        <TabPanel label="依赖资源">
          {
            null
            // TODO: 依赖资源
          }
        </TabPanel>
      </HorizonTabs>
      <AlertModal />
      <OfflineModal />
    </Root>
  )
}

const StreamInstanceDetailPage = (props: { id: string }) => {
  const { id } = props

  return (
    <AlertContext.Provider value={new AlertStore()}>
      <StreamInstanceDetail id={id} />
    </AlertContext.Provider>
  )
}

export default StreamInstanceDetailPage
