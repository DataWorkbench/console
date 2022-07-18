import { FlexBox } from 'components/Box'
import { Tooltip } from 'components/Tooltip'
import tw, { css, styled } from 'twin.macro'
// @ts-ignore
import { Button, CopyText, Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import { Collapse, Tabs } from '@QCFE/lego-ui'
import { Card } from 'components/Card'
import { Center } from 'components/Center'
import { Circle } from 'views/Space/Ops/styledComponents'
import dayjs from 'dayjs'
import LinkInstance from 'views/Space/Ops/components/LinkInstance'
import Cluster from 'views/Space/Ops/components/Cluster'
import Schedule from 'views/Space/Ops/components/Schedule'
import AlertModal from 'views/Space/Ops/Alert/Modal'
import OfflineModal from 'views/Space/Ops/DataIntegration/DataRelease/OfflineModal'
import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'
import { HorizonTabs } from 'views/Space/Dm/styled'
import { AlertStoreProvider } from 'views/Space/Ops/Alert/AlertStore'
import emitter from 'utils/emitter'
import {
  useQuerySteamJobVersionArgs,
  useQuerySteamJobVersionCode,
  useQueryStreamJobVersionDetail,
  useQueryStreamJobVersionSchedule
} from 'hooks'
import { streamDevModeType } from 'views/Space/Ops/Stream1/common/constants'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'

import { observer } from 'mobx-react-lite'
import Depends from 'views/Space/Ops/components/Depends'
import StreamDevContent from '../components/StreamDevContent'

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
  `
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

const StreamReleaseDetail = observer(({ id, version }: { id: string; version: string }) => {
  const { data, isFetching } = useQueryStreamJobVersionDetail<Record<string, any>>({
    jobId: id,
    versionId: version
  })

  const { data: args } = useQuerySteamJobVersionArgs({
    jobId: id,
    versionId: version
  })

  const { data: schedule } = useQueryStreamJobVersionSchedule({
    jobId: id,
    versionId: version
  })

  const { data: code } = useQuerySteamJobVersionCode({
    jobId: id,
    versionId: version
  })

  const history = useHistory()
  const { search } = useLocation()
  const { tab = 'link' } = qs.parse(search.slice(1))

  const [isOpen, setOpen] = useState(true)

  // const config = {} as any

  const [activeName, setActiveName] = useState(tab)
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
        <CopyTextWrapper text={`${data?.name ?? ''}(ID: ${id})`} theme="light" />
      </FlexBox>

      <Card hasBoxShadow tw="bg-neut-16 relative">
        {isFetching && (
          <div tw="absolute inset-0 z-50">
            <Loading size="large" />
          </div>
        )}
        <div tw="flex justify-between items-center px-4 h-[72px]">
          <Center tw="flex-auto">
            <Circle tw="w-10! h-10!">
              <Icon
                name={streamDevModeType[(data?.type as 2) ?? 2]?.icon}
                type="light"
                size={28}
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
                {/* <StreamReleaseStatusCmp */}
                {/*   type={data?.status as 1} */}
                {/*   tw="inline-flex" */}
                {/* /> */}
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
            {/* > */}

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
              <span>作业模式:</span>
              <span>
                <span tw="inline-block border px-1.5 text-white border-white rounded-sm leading-4 py-[1px]">
                  {streamDevModeType[data?.type as 2]?.label}
                </span>
              </span>
              <span>作业版本:</span>
              <span>{version}</span>
            </GridItem>

            <GridItem labelWidth={84}>
              <span>更新时间:</span>
              <span>{dayjs(data?.updated * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>作业描述:</span>
              <span>{data?.desc}</span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>

      <HorizonTabs
        defaultActiveName=""
        tw="bg-transparent"
        // @ts-ignore
        activeName={activeName}
        css={css`
          .tab-content {
            ${tw`p-0`}
          }
        `}
        onChange={(activeName1: string) => {
          setActiveName(activeName1)
        }}
      >
        <TabPanel label="关联实例" name="link">
          <LinkInstance jobId={id} version={version} type={JobMode.RT} />
        </TabPanel>
        <TabPanel label="监控告警" name="alarm">
          {/* <Monitor /> */}
        </TabPanel>
        <TabPanel label="开发内容" name="dev">
          <StreamDevContent data={code} language="sql" />
        </TabPanel>
        <TabPanel label="计算集群" name="cluster">
          <Cluster clusterId={args?.cluster_id} />
        </TabPanel>
        <TabPanel label="调度信息" name="schedule">
          <Schedule data={schedule} />
        </TabPanel>
        <TabPanel label="依赖资源" name="depend">
          <Depends data={args} />
        </TabPanel>
      </HorizonTabs>
      <AlertModal />
      <OfflineModal />
    </Root>
  )
})

const StreamReleaseDetailPage = (props: { id: string }) => {
  const { id } = props
  const history = useHistory()
  const { search } = useLocation()
  const { version } = qs.parse(search.slice(1))
  if (!version) {
    emitter.emit('error', {
      title: `请选择具体版本的已发布作业`
    })
    setTimeout(() => {
      history.goBack()
    }, 1500)
    return null
  }
  return (
    <AlertStoreProvider>
      <StreamReleaseDetail id={id} version={version as string} />
    </AlertStoreProvider>
  )
}

export default StreamReleaseDetailPage
