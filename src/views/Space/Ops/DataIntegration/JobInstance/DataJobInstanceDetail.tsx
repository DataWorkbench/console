// @ts-ignore
import { Breadcrumb, Button, Icon, CopyText } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Card, MoreAction, Center, Tooltip } from 'components'
import { useHistory } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import React, { useState } from 'react'
import icons from 'views/Space/Ops/DataIntegration/icons'
import { Collapse, Tabs } from '@QCFE/lego-ui'
import { HelpCenterLink } from 'components/Link'
import dayjs from 'dayjs'
import { HorizonTabs } from 'views/Space/Dm/styled'
import Cluster from 'views/Space/Ops/DataIntegration/components/Cluster'
import useIcon from 'hooks/useHooks/useIcon'
import Schedule from 'views/Space/Ops/DataIntegration/components/Schedule'
import Monitor from 'views/Space/Ops/DataIntegration/components/Monitor'
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

const DataJobInstanceDetail = (props: IDataJobInstanceDetailProps) => {
  useIcon(icons)
  const { id } = props

  const history = useHistory()

  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState('Message')
  const toList = () => {
    history.push('../data-job')
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
              数据集成-作业实例
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
                { text: '暂停', key: 'aaa' },
                { text: '重启', key: 'bbb' },
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
              <span>所属作业:</span>
              <span tw="inline-block">
                <Tooltip
                  theme="light"
                  hasPadding
                  content="发布描述：描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容。"
                >
                  <div>
                    <div>
                      <span tw="text-white font-semibold mr-1">作业1</span>
                      <span tw="text-neut-8">idadf</span>
                    </div>
                    <div tw="text-neut-8">afdafd</div>
                  </div>
                </Tooltip>
              </span>
              <span>作业模式:</span>
              <span>脚本</span>
            </GridItem>

            <GridItem>
              <span>作业类型:</span>
              <span>
                <JobTypeCmp type="1" />
              </span>
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

            <GridItem>
              <span>其他信息:</span>
              <span>
                <HelpCenterLink hasIcon>Flink UI</HelpCenterLink>
              </span>
              <span>开始时间:</span>
              <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>更新时间:</span>
              <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
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
        <TabPanel label="Message" name="Message">
          <div
            css={css`
              overflow-wrap: anywhere;
            `}
            tw="whitespace-pre-wrap bg-transparent"
          >
            {
              '"[{\\"type\\":\\"TEXT\\",\\"data\\":\\"Table has been dropped.\\\\nTable has been created.\\\\nTable has been dropped.\\\\nTable has been created.\\\\nTable has been dropped.\\\\nTable has been created.\\\\nTable has been dropped.\\\\nTable has been created.\\\\n\\"},{\\"type\\":\\"TEXT\\",\\"data\\":\\"Fail to run sql command: INSERT INTO output_uv\\\\nSELECT\\\\n  \\\\u0027userids\\\\u0027                AS `userids`,\\\\n  COUNT(distinct user_id)  AS uv,\\\\n  TO_TIMESTAMP(FROM_UNIXTIME(UNIX_TIMESTAMP(),\\\\u0027yyyy-MM-dd HH:mm:ss\\\\u0027)) AS create_time\\\\nFROM input_web_record\\\\nGROUP BY user_id\\\\njava.io.IOException: org.apache.flink.table.api.ValidationException: Unable to create a source for reading table \\\\u0027default_catalog.default_database.input_web_record\\\\u0027.\\\\n\\\\nTable options are:\\\\n\\\\n\\\\u0027connector\\\\u0027\\\\u003d\\\\u0027kafka\\\\u0027\\\\n\\\\u0027format\\\\u0027\\\\u003d\\\\u0027json\\\\u0027\\\\n\\\\u0027json.fail-on-missing-field\\\\u0027\\\\u003d\\\\u0027false\\\\u0027\\\\n\\\\u0027json.ignore-parse-errors\\\\u0027\\\\u003d\\\\u0027true\\\\u0027\\\\n\\\\u0027properties.bootstrap.servers\\\\u0027\\\\u003d\\\\u0027192.168.100.16:9092,192.168.100.17:9092,192.168.100.18:9092\\\\u0027\\\\n\\\\u0027properties.group.id\\\\u0027\\\\u003d\\\\u0027record\\\\u0027\\\\n\\\\u0027scan.startup.mode\\\\u0027\\\\u003d\\\\u0027 earliest-offset\\\\u0027\\\\n\\\\u0027topic\\\\u0027\\\\u003d\\\\u0027uvpv-demo112\\\\u0027\\\\n\\\\tat org.apache.zeppelin.flink.FlinkSqlInterrpeter.callInsertInto(FlinkSqlInterrpeter.java:529)\\\\n\\\\tat org.apache.zeppelin.flink.FlinkStreamSqlInterpreter.callInsertInto(FlinkStreamSqlInterpreter.java:97)\\\\n\\\\tat org.apache.zeppelin.flink.FlinkSqlInterrpeter.callCommand(FlinkSqlInterrpeter.java:264)\\\\n\\\\tat org.apache.zeppelin.flink.FlinkSqlInterrpeter.runSqlList(FlinkSqlInterrpeter.java:151)\\\\n\\\\tat org.apache.zeppelin.flink.FlinkSqlInterrpeter.internalInterpret(FlinkSqlInterrpeter.java:111)\\\\n\\\\tat org.apache.zeppelin.interpreter.AbstractInterpreter.interpret(AbstractInterpreter.java:47)\\\\n\\\\tat org.apache.zeppelin.interpreter.LazyOpenInterpreter.interpret(LazyOpenInterpreter.java:110)\\\\n\\\\tat org.apache.zeppelin.interpreter.remote.RemoteInterpreterServer$InterpretJob.jobRun(RemoteInterpreterServer.java:852)\\\\n\\\\tat org.apache.zeppelin.interpreter.remote.RemoteInterpreterServer$InterpretJob.jobRun(RemoteInterpreterServer.java:744)\\\\n\\\\tat org.apache.zeppelin.scheduler.Job.run(Job.java:172)\\\\n\\\\tat org.apache.zeppelin.scheduler.AbstractScheduler.runJob(AbstractScheduler.java:132)\\\\n\\\\tat org.apache.zeppelin.scheduler.ParallelScheduler.lambda$runJobInScheduler$0(ParallelScheduler.java:46)\\\\n\\\\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)\\\\n\\\\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)\\\\n\\\\tat java.lang.Thread.run(Thread.java:748)\\\\nCaused by: org.apache.flink.table.api.ValidationException: Unable to create a source for reading table \\\\u0027default_catalog.default_database.input_web_record\\\\u0027.\\\\n\\\\nTable options are:\\\\n\\\\n\\\\u0027connector\\\\u0027\\\\u003d\\\\u0027kafka\\\\u0027\\\\n\\\\u0027format\\\\u0027\\\\u003d\\\\u0027json\\\\u0027\\\\n\\\\u0027json.fail-on-missing-field\\\\u0027\\\\u003d\\\\u0027false\\\\u0027\\\\n\\\\u0027json.ignore-parse-errors\\\\u0027\\\\u003d\\\\u0027true\\\\u0027\\\\n\\\\u0027properties.bootstrap.servers\\\\u0027\\\\u003d\\\\u0027192.168.100.16:9092,192.168.100.17:9092,192.168.100.18:9092\\\\u0027\\\\n\\\\u0027properties.group.id\\\\u0027\\\\u003d\\\\u0027record\\\\u0027\\\\n\\\\u0027scan.startup.mode\\\\u0027\\\\u003d\\\\u0027 earliest-offset\\\\u0027\\\\n\\\\u0027topic\\\\u0027\\\\u003d\\\\u0027uvpv-demo112\\\\u0027\\\\n\\\\tat org.apache.flink.table.factories.FactoryUtil.createTableSource(FactoryUtil.java:122)\\\\n\\\\tat org.apache.flink.table.planner.plan.schema.CatalogSourceTable.createDynamicTableSource(CatalogSourceTable.java:254)\\\\n\\\\tat org.apache.flink.table.planner.plan.schema.CatalogSourceTable.toRel(CatalogSourceTable.java:100)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.toRel(SqlToRelConverter.java:3585)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertIdentifier(SqlToRelConverter.java:2507)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertFrom(SqlToRelConverter.java:2144)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertFrom(SqlToRelConverter.java:2093)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertFrom(SqlToRelConverter.java:2050)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertSelectImpl(SqlToRelConverter.java:663)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertSelect(SqlToRelConverter.java:644)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertQueryRecursive(SqlToRelConverter.java:3438)\\\\n\\\\tat org.apache.calcite.sql2rel.SqlToRelConverter.convertQuery(SqlToRelConverter.java:570)\\\\n\\\\tat org.apache.flink.table.planner.calcite.FlinkPlannerImpl.org$apache$flink$table$planner$calcite$FlinkPlannerImpl$$rel(FlinkPlannerImpl.scala:165)\\\\n\\\\tat org.apache.flink.table.planner.calcite.FlinkPlannerImpl.rel(FlinkPlannerImpl.scala:157)\\\\n\\\\tat org.apache.flink.table.planner.operations.SqlToOperationConverter.toQueryOperation(SqlToOperationConverter.java:902)\\\\n\\\\tat org.apache.flink.table.planner.operations.SqlToOperationConverter.convertSqlQuery(SqlToOperationConverter.java:871)\\\\n\\\\tat org.apache.flink.table.planner.operations.SqlToOperationConverter.convert(SqlToOperationConverter.java:250)\\\\n\\\\tat org.apache.flink.table.planner.operations.SqlToOperationConverter.convertSqlInsert(SqlToOperationConverter.java:564)\\\\n\\\\tat org.apache.flink.table.planner.operations.SqlToOperationConverter.convert(SqlToOperationConverter.java:248)\\\\n\\\\tat org.apache.flink.table.planner.delegation.ParserImpl.parse(ParserImpl.java:77)\\\\n\\\\tat org.apache.flink.table.api.internal.TableEnvironmentImpl.sqlUpdate(TableEnvironmentImpl.java:733)\\\\n\\\\tat org.apache.zeppelin.flink.FlinkSqlInterrpeter.callInsertInto(FlinkSqlInterrpeter.java:521)\\\\n\\\\t... 14 more\\\\nCaused by: org.apache.flink.table.api.ValidationException: Invalid value for option \\\\u0027scan.startup.mode\\\\u0027. Supported values are [earliest-offset, latest-offset, group-offsets, specific-offsets, timestamp], but was:  earliest-offset\\\\n\\\\tat org.apache.flink.streaming.connectors.kafka.table.KafkaOptions.lambda$validateScanStartupMode$0(KafkaOptions.java:311)\\\\n\\\\tat java.util.Optional.ifPresent(Optional.java:159)\\\\n\\\\tat org.apache.flink.streaming.connectors.kafka.table.KafkaOptions.validateScanStartupMode(KafkaOptions.java:307)\\\\n\\\\tat org.apache.flink.streaming.connectors.kafka.table.KafkaOptions.validateTableSourceOptions(KafkaOptions.java:263)\\\\n\\\\tat org.apache.flink.streaming.connectors.kafka.table.KafkaDynamicTableFactory.createDynamicTableSource(KafkaDynamicTableFactory.java:145)\\\\n\\\\tat org.apache.flink.table.factories.FactoryUtil.createTableSource(FactoryUtil.java:119)\\\\n\\\\t... 35 more\\\\n\\\\n\\"}]"'
            }
          </div>
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

export default DataJobInstanceDetail
