import {
  Card,
  CardHeader,
  CardContent,
  IconCard,
  HelpCenterLink,
} from 'components'
import tw, { styled } from 'twin.macro'

const IconCardWrapper = styled(IconCard)(() => [tw`items-center w-[108px]`])

const BestPractice = () => (
  <div tw="flex mt-4">
    <Card tw="flex-1 mr-4">
      <CardHeader title="最佳实践" />
      <CardContent>
        <div tw="grid grid-cols-2 space-x-2 2xl:space-x-5">
          <HelpCenterLink
            href="/best-practices/practice01/summary/"
            color=""
            tw="no-underline font-normal text-left"
          >
            <IconCard
              icon="templet"
              title="实时同步 MySQL 数据到 Elasticsearch"
              subtitle={
                <div
                  tw="h-10  overflow-hidden"
                  css={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  本实践为您介绍如何将 MySQL 数据实时（upsert 或 append）同步到
                  Elasticsearch
                </div>
              }
            />
          </HelpCenterLink>
          <HelpCenterLink
            href="/best-practices/practice02/summary/"
            color=""
            tw="no-underline font-normal text-left"
          >
            <IconCard
              icon="templet"
              title="实时计算 uv、pv、转化率（SQL 作业）"
              subtitle={
                <div
                  tw="h-10 overflow-hidden"
                  css={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  本实践为您介绍如何通过
                  SQL作业对接网站的点击流数据，并对点击流数据进行实时分析，计算出独立访客数（uv）、页面访问数（pv）、转化率等指标
                </div>
              }
            />
          </HelpCenterLink>
        </div>
      </CardContent>
    </Card>
    <Card tw="w-4/12 leading-5">
      <CardHeader title="相关产品" />
      <CardContent tw="pb-3 flex justify-center space-x-2 2xl:space-x-5">
        <a
          href="https://appcenter.qingcloud.com/apps/app-6iuoe9qs?name=QingMR"
          target="_blank"
          rel="noreferrer"
        >
          <IconCardWrapper icon="qing-mr" title="QingMr" layout="vertical" />
        </a>
        <a
          href="https://appcenter.qingcloud.com/apps/app-n9ro0xcp?name=Kafka"
          target="_blank"
          rel="noreferrer"
        >
          <IconCardWrapper icon="kafka" title="Kafka" layout="vertical" />
        </a>
        <a
          href="https://appcenter.qingcloud.com/apps/app-3k61fkmg?name=HBase"
          target="_blank"
          rel="noreferrer"
        >
          <IconCardWrapper
            icon="click-house"
            title="ClickHouse"
            layout="vertical"
          />
        </a>
      </CardContent>
    </Card>
  </div>
)

export default BestPractice
