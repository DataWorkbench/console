import React from 'react'
import { Card, CardHeader, CardContent, IconCard, HelpCenterLink } from 'components'
import { css } from 'twin.macro'

interface Props {
  className?: string
}

const Practice: React.FC<Props> = ({ className }) => (
  <Card className={className} hasBoxShadow>
    <CardHeader
      title={
        <span
          css={css`
            font-weight: 700;
            font-size: 20px;
            line-height: 27px;
            letter-spacing: -0.03em;
            color: #333333;
          `}
        >
          最佳实践
        </span>
      }
      hasPrex={false}
    />
    <CardContent>
      <div tw="grid grid-cols-3 space-x-2 2xl:space-x-5">
        <HelpCenterLink
          href="/best-practices/practice01/summary/"
          color=""
          tw="no-underline font-normal text-left"
        >
          <IconCard
            icon="enfi-best1"
            title={
              <span
                css={css`
                  font-weight: 600;
                  font-size: 14px;
                  line-height: 19px;
                  letter-spacing: -0.03em;
                  color: #666666;
                `}
              >
                实时同步 MySQL 数据到 Elasticsearch
              </span>
            }
            css={css`
              background: rgba(240, 242, 245, 0.1);
              border: 1px solid #dfecff;
            `}
            subtitle={
              <div
                tw="h-10  overflow-hidden"
                css={[
                  {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  },
                  css`
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 16px;
                    letter-spacing: -0.03em;
                    color: #666666;
                  `
                ]}
              >
                本实践为您介绍如何将 MySQL 数据实时（upsert 或 append）同步到 Elasticsearch
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
            icon="enfi-best2"
            title={
              <span
                css={css`
                  font-weight: 600;
                  font-size: 14px;
                  line-height: 19px;
                  letter-spacing: -0.03em;
                  color: #666666;
                `}
              >
                实时计算 uv、pv、转化率（SQL 作业）
              </span>
            }
            css={css`
              background: rgba(240, 242, 245, 0.1);
              border: 1px solid #dfecff;
            `}
            subtitle={
              <div
                tw="h-10 overflow-hidden"
                css={[
                  {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  },
                  css`
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 16px;
                    letter-spacing: -0.03em;
                    color: #666666;
                  `
                ]}
              >
                本实践为您介绍如何通过
                SQL作业对接网站的点击流数据，并对点击流数据进行实时分析，计算出独立访客数（uv）、页面访问数（pv）、转化率等指标
              </div>
            }
          />
        </HelpCenterLink>
        <HelpCenterLink
          href="/best-practices/practice03/summary/"
          color=""
          tw="no-underline font-normal text-left"
        >
          <IconCard
            icon="enfi-best3"
            title={
              <span
                css={css`
                  font-weight: 600;
                  font-size: 14px;
                  line-height: 19px;
                  letter-spacing: -0.03em;
                  color: #666666;
                `}
              >
                实时计算 Kafka 数据到 ELK (实时同步作业)
              </span>
            }
            css={css`
              background: rgba(240, 242, 245, 0.1);
              border: 1px solid #dfecff;
            `}
            subtitle={
              <div
                tw="h-10 overflow-hidden"
                css={[
                  {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  },
                  css`
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 16px;
                    letter-spacing: -0.03em;
                    color: #666666;
                  `
                ]}
              >
                本实践为您介绍如何通过数据集成-实时同步作业将 Kafka 数据实时同步到 Elasticsearch。
              </div>
            }
          />
        </HelpCenterLink>
      </div>
    </CardContent>
  </Card>
)

export default Practice
