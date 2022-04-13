// @ts-ignore
import { Breadcrumb, Button, CopyText, Icon } from '@QCFE/qingcloud-portal-ui'
import { Card, Center, FlexBox, MoreAction } from 'components'
import { useHistory } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import React, { useState } from 'react'
import icons from 'views/Space/Ops/DataIntegration/icons'
import { Collapse, Tabs } from '@QCFE/lego-ui'
import dayjs from 'dayjs'
import { HorizonTabs } from 'views/Space/Dm/styled'
import Cluster from 'views/Space/Ops/DataIntegration/components/Cluster'
import useIcon from 'hooks/useHooks/useIcon'
import Schedule from 'views/Space/Ops/DataIntegration/components/Schedule'
import Monitor from 'views/Space/Ops/DataIntegration/components/Monitor'
import LinkInstance from 'views/Space/Ops/DataIntegration/components/LinkInstance'
import {
  AlarmStatusCmp,
  Circle,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from '../styledComponents'

interface IDataJobInstanceDetailProps {
  id: string
}

const { TabPanel } = Tabs as any
const { CollapsePanel } = Collapse

const { BreadcrumbItem } = Breadcrumb as any

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
      ${tw`overflow-y-auto px-0 py-4`}
    }
  }
`

const BreadcrumbWrapper = styled.div`
  & {
    ${tw`pt-3 px-4 mb-0!`}
    & .breadcrumb-item {
      &,
      & .breadcrumb-separator {
        ${tw`text-neut-8!`}
      }
    }

    & .breadcrumb-last-item .copy-text {
      &:hover .text-field {
        ${tw`text-white!`}
      }
    }
  }
`

const DataReleaseDetail = (props: IDataJobInstanceDetailProps) => {
  useIcon(icons)
  const { id } = props

  const history = useHistory()

  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState('Message')
  const toList = () => {
    history.push('../data-release')
  }
  return (
    <Root tw="">
      <BreadcrumbWrapper>
        <Breadcrumb>
          <BreadcrumbItem>
            <span
              onClick={toList}
              tw="hover:text-link active:text-link cursor-pointer text-neut-8"
            >
              数据集成-已发布作业
            </span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <CopyText text={id} />
          </BreadcrumbItem>
        </Breadcrumb>
      </BreadcrumbWrapper>
      <Card hasBoxShadow tw="bg-neut-16">
        <div tw="flex justify-between items-center px-4 h-[72px]">
          <Center>
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
            <div tw="flex-1">
              <div tw="text-white">qwerqwerqw</div>
              <div tw="text-neut-8">fresa</div>
            </div>
          </Center>
          <FlexBox tw="gap-4">
            <MoreAction
              items={[
                { text: '下线', key: 'aaa' },
                { text: '重新发布', key: 'bbb' },
              ]}
              type="button"
              buttonText="更多操作"
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
              <span>调度状态:</span>
              <span>
                <JobInstanceStatusCmp type="1" />
              </span>
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
                <div tw="align-middle">
                  <span tw="h-3 bg-white text-neut-13 px-2 font-medium rounded-[2px] mr-2">
                    mysql
                  </span>
                  <span>mysql11212</span>
                </div>
                <div tw="text-neut-8">id_dfafda</div>
              </span>
              <span>数据目的:</span>
              <span tw="inline-block">
                <div tw="align-middle">
                  <span tw="h-3 bg-white text-neut-13 px-2 font-medium rounded-[2px] mr-2">
                    mysql
                  </span>
                  <span>mysql11212</span>
                </div>
                <div tw="text-neut-8">id_dfafda</div>
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
        tw="overflow-hidden bg-transparent"
        activeName={activeName}
        onChange={(activeName1: string) => {
          setActiveName(activeName1)
        }}
      >
        <TabPanel label="关联实例" name="link">
          <LinkInstance />
        </TabPanel>
        <TabPanel label="监控告警" name="Monitor">
          <Monitor />
        </TabPanel>
        <TabPanel label="开发内容" name="Develop">
          <div>3</div>
        </TabPanel>
        <TabPanel label="计算集群" name="Cluster">
          <Cluster data={{}} />
        </TabPanel>
        <TabPanel label="调度信息" name="Schedule">
          <Schedule data={{}} />
        </TabPanel>
      </HorizonTabs>
    </Root>
  )
}

export default DataReleaseDetail
