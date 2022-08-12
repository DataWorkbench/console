// @ts-ignore
import { Button, CopyText, Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import { Card, Center, FlexBox, MoreAction, Tooltip } from 'components'
import { useHistory, useLocation } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import React, { useState } from 'react'
import icons from 'views/Space/Ops/icons'
import { Collapse, Tabs } from '@QCFE/lego-ui'
import dayjs from 'dayjs'
import qs from 'qs'
import { HorizonTabs } from 'views/Space/Dm/styled'
import Cluster from 'views/Space/Ops/components/Cluster'
import useIcon from 'hooks/useHooks/useIcon'
import Schedule from 'views/Space/Ops/components/Schedule'
import Monitor from 'views/Space/Ops/components/Monitor'
import LinkInstance from 'views/Space/Ops/components/LinkInstance'
// import DevContent from 'views/Space/Ops/components/DevContent'
import { observer } from 'mobx-react-lite'
import AlertModal from 'views/Space/Ops/Alert/Modal'
import DataSourceModal from 'views/Space/Ops/DataIntegration/DataRelease/DataSourceModal'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import {
  useQuerySyncJobVersionConf,
  useQuerySyncJobVersionDetail,
  useQuerySyncJobVersionSchedule
} from 'hooks/useJobVersion'
import OfflineModal from 'views/Space/Ops/DataIntegration/DataRelease/OfflineModal'
import { useMutationJobRelease } from 'hooks'
import { Circle, DbTypeCmp, JobTypeCmp, JobInstanceStatusCmp } from '../../styledComponents'
import {
  dataReleaseDetailActions,
  DataReleaseDevMode,
  dataReleaseDevModeType,
  DataReleaseSchedule,
  dataReleaseScheduleType
} from '../constants'

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
      ${tw`min-h-full`}
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

  // const { regionId, spaceId } = useParams<IRouteParams>()

  const { showDataSource, set, datasourceId, datasourceType } = useDataReleaseStore()

  const history = useHistory()
  const { search } = useLocation()
  const { tab = 'link' } = qs.parse(search.slice(1))

  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState(tab)
  const toList = () => {
    history.push('../data-release')
  }

  const { data, isFetching, refetch } = useQuerySyncJobVersionDetail<Record<string, any>>({
    jobId: id,
    versionId: version
  })

  const { data: scheduleData } = useQuerySyncJobVersionSchedule({
    jobId: id,
    versionId: version
  })

  const { data: config } = useQuerySyncJobVersionConf({
    jobId: id,
    versionId: version
  })

  const mutation = useMutationJobRelease()

  const handleAction = (d: Record<string, any>, type: string) => {
    switch (type) {
      case 'offline':
        set({
          showOffline: true,
          selectedData: data
        })
        break
      case 're-publish':
        mutation
          .mutateAsync({
            op: 'release',
            jobId: id
          })
          .then(() => {
            refetch()
          })

        break
      default:
        break
    }
  }

  const filterActionFn = (item: { key: string }) => {
    let filterActionKey = ''

    if (dataReleaseScheduleType[data?.status as 2]?.type === DataReleaseSchedule.DOWNED) {
      filterActionKey = 'offline'
    } else {
      filterActionKey = 're-publish'
    }
    return item.key !== filterActionKey
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
                name="q-downloadBoxFill"
                type="light"
                size={28}
                css={css`
                  & .qicon {
                    ${tw`text-white! fill-[#fff]! `}
                  }
                `}
              />
            </Circle>
            <div tw="flex-auto">
              <div tw="text-white">
                <span tw="mr-3">{data?.name}</span>
                {/* // NOTE: 历史版本没有调度信息 */}
                {false && <JobInstanceStatusCmp type={data?.status as 1} tw="inline-flex" />}
              </div>
              <div tw="text-neut-8">{data?.id}</div>
            </div>
          </Center>
          <FlexBox tw="gap-4">
            {false && (
              <MoreAction
                items={dataReleaseDetailActions.filter(filterActionFn).map((i) => ({
                  ...i,
                  value: data
                }))}
                type="button"
                buttonText="更多操作"
                placement="bottom-start"
                onMenuClick={handleAction}
              />
            )}

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
              <span>版本 ID:</span>
              <span>{data?.version}</span>
              <span>作业模式:</span>
              <span>{dataReleaseDevModeType[config?.job_mode as 1]?.label}</span>
              <span>作业类型:</span>
              <span>
                <JobTypeCmp type={data?.type} />
              </span>
            </GridItem>

            <GridItem>
              <span>数据来源:</span>
              <span tw="inline-block">
                {dataReleaseDevModeType[config?.job_mode as 1]?.type === DataReleaseDevMode.UI &&
                  config?.source_id && (
                    <div tw="align-middle" css={[tw`cursor-pointer  hover:text-green-11`]}>
                      <DbTypeCmp
                        devMode={config?.job_type}
                        type={data?.source_type}
                        onClick={() =>
                          set({
                            showDataSource: true,
                            datasourceType: data?.source_type,
                            datasourceId: config?.source_id
                          })
                        }
                      />
                      <span tw="ml-1">{config?.source_name}</span>
                    </div>
                  )}
                {dataReleaseDevModeType[config?.job_mode as 1]?.type ===
                  DataReleaseDevMode.SCRIPT && (
                  <DbTypeCmp devMode={config?.job_type} type={data?.source_type} />
                )}
                <div tw="text-neut-8">{config?.source_id}</div>
              </span>
              <span>数据目的:</span>

              <span tw="inline-block">
                {dataReleaseDevModeType[config?.job_mode as 1]?.type === DataReleaseDevMode.UI &&
                  config?.target_id && (
                    <div tw="align-middle" css={[tw`cursor-pointer  hover:text-green-11`]}>
                      <DbTypeCmp
                        devMode={config?.job_type}
                        type={data?.target_type}
                        onClick={() =>
                          set({
                            showDataSource: true,
                            datasourceType: data?.target_type,
                            datasourceId: config?.target_id
                          })
                        }
                      />
                      <span tw="ml-1">{config?.target_name}</span>
                    </div>
                  )}
                {dataReleaseDevModeType[config?.job_mode as 1]?.type ===
                  DataReleaseDevMode.SCRIPT && (
                  <DbTypeCmp devMode={config?.job_type} type={data?.target_type} />
                )}
                <div tw="text-neut-8">{config?.target_id}</div>
              </span>
            </GridItem>

            <GridItem labelWidth={84}>
              {/* <span>生效时间:</span> */}
              {/* <span> */}
              {/*   {dayjs(data?.created * 1000).format('YYYY-MM-DD HH:mm:ss')} */}
              {/* </span> */}
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
        onChange={(activeName1: string) => {
          setActiveName(activeName1)
        }}
        css={css`
          .tab-content {
            ${tw`p-0`}
          }
        `}
      >
        <TabPanel label="关联实例" name="link">
          <LinkInstance jobId={id} version={version} />
        </TabPanel>
        <TabPanel label="监控告警" name="alarm">
          <Monitor jobId={id} showAdd jobType={2} />
        </TabPanel>
        {/* <TabPanel label="开发内容" name="dev"> */}
        {/*   <DevContent data={config} curJob={data} /> */}
        {/* </TabPanel> */}
        <TabPanel label="计算集群" name="cluster">
          <Cluster clusterId={config?.cluster_id} />
        </TabPanel>
        <TabPanel label="调度信息" name="schedule">
          <Schedule data={scheduleData} />
        </TabPanel>
      </HorizonTabs>
      <AlertModal />
      {showDataSource && (
        <DataSourceModal
          datasourceId={datasourceId}
          datasourceType={datasourceType}
          onCancel={() => set({ showDataSource: false })}
        />
      )}
      <OfflineModal refetch={refetch} />
    </Root>
  )
})
export default DataReleaseDetail
