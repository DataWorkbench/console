// @ts-ignore
import { Button, CopyText, Icon } from '@QCFE/qingcloud-portal-ui'
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
  AlarmStatusCmp,
  Circle,
  DbTypeCmp,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from '../styledComponents'
import { dataReleaseDetailActions } from '../constants'

interface IDataJobInstanceDetailProps {
  id: string
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
  const { id } = props

  const { showDataSource, set } = useDataReleaseStore()
  const data = { name: 'work' }

  const history = useHistory()
  const { search } = useLocation()
  const { tab = 'link' } = qs.parse(search.slice(1))
  console.log(history, tab)

  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState(tab)
  const toList = () => {
    history.push('../data-release')
  }
  return (
    <Root tw="">
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
        <CopyTextWrapper text={`${data.name}(ID: ${id})`} theme="light" />
      </FlexBox>
      {/* <BreadcrumbWrapper> */}
      {/*   <Breadcrumb> */}
      {/*     <BreadcrumbItem> */}
      {/*       <span */}
      {/*         onClick={toList} */}
      {/*         tw="hover:text-link active:text-link cursor-pointer text-neut-8" */}
      {/*       > */}
      {/*         数据集成-已发布作业 */}
      {/*       </span> */}
      {/*     </BreadcrumbItem> */}
      {/*     <BreadcrumbItem> */}
      {/*       <CopyText text={id} /> */}
      {/*     </BreadcrumbItem> */}
      {/*   </Breadcrumb> */}
      {/* </BreadcrumbWrapper> */}
      <Card hasBoxShadow tw="bg-neut-16">
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
                <AlarmStatusCmp type="1" />
              </span>
              <span>版本 ID:</span>
              <span>asdfasdfa</span>
              <span>作业模式:</span>
              <span>脚本</span>

              <span>作业类型:</span>
              <span>
                <JobTypeCmp type="1" />
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
                  <DbTypeCmp type="MySQL" onClick={() => {}} />
                  <span tw="ml-1">mysql11212</span>
                </div>
                <div tw="text-neut-8">id_dfafda</div>
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
              <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>最近发布时间:</span>
              <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>发布描述:</span>
              <span>发布内容发布内容</span>
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
          <Cluster data={{}} />
        </TabPanel>
        <TabPanel label="调度信息" name="schedule">
          <Schedule data={{}} />
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
