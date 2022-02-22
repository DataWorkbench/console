import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  IconCard,
  HelpCenterLink,
} from 'components'

interface Props {
  className?: string
}

const Practice: React.FC<Props> = ({ className }) => {
  return (
    <Card className={className} hasBoxShadow>
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
  )
}

export default Practice
