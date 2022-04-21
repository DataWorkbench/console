// @ts-ignore
import { Button, CopyText, Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import { Card, Center, FlexBox, MoreAction, Tooltip } from 'components'
import { useHistory, useLocation } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import React, { useState } from 'react'
import icons from 'views/Space/Ops/DataIntegration/icons'
import { Collapse, Tabs } from '@QCFE/lego-ui'
import dayjs from 'dayjs'
import qs from 'qs'
import { HorizonTabs } from 'views/Space/Dm/styled'
import Cluster from 'views/Space/Ops/DataIntegration/components/Cluster'
import useIcon from 'hooks/useHooks/useIcon'
import Schedule from 'views/Space/Ops/DataIntegration/components/Schedule'
import Monitor from 'views/Space/Ops/DataIntegration/components/Monitor'
import LinkInstance from 'views/Space/Ops/DataIntegration/components/LinkInstance'
import DevContent from 'views/Space/Ops/DataIntegration/components/DevContent/DevContentUI'
import { observer } from 'mobx-react-lite'
import AlertModal from 'views/Space/Ops/Alert/Modal'
import DataSourceModal from 'views/Space/Ops/DataIntegration/DataRelease/DataSourceModal'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import {
  useQuerySyncJobVersionDetail,
  useQuerySyncJobVersionSchedule,
} from 'hooks/useJobVersion'
import {
  AlarmStatusCmp,
  Circle,
  DbTypeCmp,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from '../styledComponents'
import { dataReleaseDetailActions } from '../constants'

interface IDataJobInstanceDetailProps {
  id: string
  version: string
}

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

const DataReleaseDetail = observer((props: IDataJobInstanceDetailProps) => {
  useIcon(icons)
  const { id, version } = props

  console.log(version)
  const { showDataSource, set } = useDataReleaseStore()

  const history = useHistory()
  const { search } = useLocation()
  const { tab = 'link' } = qs.parse(search.slice(1))

  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState(tab)
  const toList = () => {
    history.push('../data-release')
  }

  const { data, isFetching } = useQuerySyncJobVersionDetail<
    Record<string, any>
  >({
    jobId: id,
    versionId: version,
  })

  const { data: scheduleData } = useQuerySyncJobVersionSchedule({
    jobId: id,
    versionId: version,
  })

  return (
    <Root tw="relative">
      <FlexBox tw="items-center gap-2">
        <Tooltip theme="light" content="返回" hasPadding placement="bottom">
          <Icon
            name="previous"
            size={20}
            clickable
            type="light"
            onClick={() => toList()}
            css={css`
              svg.qicon {
                ${tw`text-[#939EA9]! fill-[#939EA9]!`}
              }
            `}
          />
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
                name="q-mergeFillDuotone"
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
                <span tw="mr-3">qwerqwerqw</span>
                <JobInstanceStatusCmp type="1" tw="inline-flex" />
              </div>
              <div tw="text-neut-8">fresa</div>
            </div>
          </Center>
          <FlexBox tw="gap-4">
            <MoreAction
              items={dataReleaseDetailActions.map((i) => ({
                ...i,
                value: data,
              }))}
              type="button"
              buttonText="更多操作"
              placement="bottom-start"
            />

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
              <span>版本 ID:</span>
              <span>{data?.version}</span>
              <span>作业模式:</span>
              <span>
                {
                  // TODO: 作业模式字段
                  ''
                }
              </span>
              <span>作业类型:</span>
              <span>
                <JobTypeCmp type={data?.type} />
              </span>
            </GridItem>

            <GridItem>
              <span>数据来源:</span>
              <span tw="inline-block">
                <div
                  tw="align-middle hover:text-green-11"
                  css={[tw`cursor-pointer`]}
                  onClick={() => set({ showDataSource: true })}
                >
                  <DbTypeCmp type={data?.source_type} onClick={() => {}} />
                  <span tw="ml-1">{data?.source_name}</span>
                </div>
                <div tw="text-neut-8">{data?.source_id}</div>
              </span>
              <span>数据目的:</span>
              <span tw="inline-block">
                <div tw="align-middle">
                  <DbTypeCmp devMode="1" type="MySQL" onClick={undefined} />
                </div>
              </span>
            </GridItem>

            <GridItem labelWidth={84}>
              <span>生效时间:</span>
              <span>{dayjs(data?.created).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>最近发布时间:</span>
              <span>{dayjs(data?.updated).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>发布描述:</span>
              <span>{data?.desc}</span>
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
        <TabPanel label="关联实例" name="link">
          <LinkInstance />
        </TabPanel>
        <TabPanel label="监控告警" name="alarm">
          <Monitor />
        </TabPanel>
        <TabPanel label="开发内容" name="dev">
          <DevContent data={{}} />
        </TabPanel>
        <TabPanel label="计算集群" name="cluster">
          <Cluster clusterId="" />
        </TabPanel>
        <TabPanel label="调度信息" name="schedule">
          <Schedule data={scheduleData} />
        </TabPanel>
      </HorizonTabs>
      <AlertModal />
      {showDataSource && (
        <DataSourceModal
          onCancel={() => {
            set({
              showDataSource: false,
            })
          }}
        />
      )}
    </Root>
  )
})
export default DataReleaseDetail
