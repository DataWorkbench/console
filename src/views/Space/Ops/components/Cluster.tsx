import { Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import tw, { styled } from 'twin.macro'
import { AffixLabel, TextLink, FlexBox } from 'components/index'
import React from 'react'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { useQueryDescribeFlinkCluster } from 'hooks'

const Header = styled(FlexBox)`
  ${tw`rounded-[2px] bg-neut-16 px-6 py-3`}
`

const Title = styled.div`
  ${tw`flex items-center text-white gap-2`}
`

const Context = styled.div`
  ${tw`p-5 leading-[20px]`}
  & > div {
    ${tw`not-last:border-b border-neut-15 not-last:pb-4 not-first:pt-4`}
  }
`

const Grid = styled.div`
  ${tw`grid gap-2 mt-3 pl-6`}
  & {
    grid-template-columns: 96px 1fr;
    & > div:nth-of-type(2n + 1) {
      ${tw`text-neut-8`}
    }
    & > div:nth-of-type(2n) {
      ${tw`text-white`}
    }
  }
`

const restartStrategy = [
  {
    label: 'NoRestart:  不重启',
    value: 'none',
  },
  {
    label: 'FixedDelay:  固定延迟',
    value: 'fixed-delay',
  },
  {
    label: 'FailureRate: 故障率',
    value: 'failure-rate',
  },
]

const logs = [
  { label: 'TRACE：追踪级别', value: 'TRACE' },
  { label: 'DEBUG：调试级别', value: 'DEBUG' },
  { label: 'INFO：信息级别', value: 'INFO' },
  { label: 'WARN：警告级别', value: 'WARN' },
  { label: 'ERROR：错误级别', value: 'ERROR' },
]

const Cluster = ({ clusterId }: { clusterId?: string }) => {
  const { regionId } = useParams<{ regionId: string }>()
  const { data, isFetching } = useQueryDescribeFlinkCluster(
    { clusterId },
    { enabled: !!clusterId }
  )

  if (!clusterId || isFetching) {
    return (
      <div tw="min-h-[300px] w-full">
        <Loading size="large" />
      </div>
    )
  }

  return (
    <div tw="w-full border border-line-dark">
      <Header>
        <Icon name="pod" size={40} type="light" />
        <div tw="ml-3">
          <div tw="text-white font-semibold">计算集群 {data?.name}</div>
          <div tw="text-neut-8">版本:{data?.version}</div>
        </div>
      </Header>
      <Context>
        <div>
          <Title>
            <Icon type="light" name="q-noteFill" />
            <span>基础信息</span>
          </Title>
          <Grid>
            <div>
              <AffixLabel
                theme="light"
                required={false}
                help="重启策略是指在 Flink Job 发生故障时，如何处理 Job。包括 No Restarts:不重启、Fixed Delay:固定延迟、Failure Rate:故障率，默认为不重启。"
              >
                重启策略
              </AffixLabel>
            </div>
            <div>
              {
                restartStrategy.find(
                  (i) =>
                    i.value === data?.config?.restart_strategy?.restart_strategy
                )?.label
              }
            </div>
            <div>尝试重启次数</div>
            <div>{data?.config?.fixed_delay_attempts}</div>
            <div>重启时间间隔</div>
            <div>
              {data?.config?.failure_rate_delay
                ? `${data?.config?.failure_rate_delay} s`
                : ''}
            </div>
          </Grid>
        </div>
        <div>
          <Title>
            <Icon type="light" name="q-noteGearFill" />
            <span>资源配置信息</span>
          </Title>
          <Grid>
            <div>
              <AffixLabel
                help="Flink 的 TaskManager 的数量"
                required={false}
                theme="light"
              >
                TM 数量
              </AffixLabel>
            </div>
            <div>{data?.task_num}</div>
            <div>TM 规格</div>
            <div>
              <span tw="text-white">{data?.task_cu}</span>
              <span tw="text-neut-8">（每 CU：1核 4G）</span>
            </div>
            <div>JM 规格</div>
            <div>
              <span tw="text-white">{data?.job_cu}</span>
              <span tw="text-neut-8">（每 CU：1核 4G）</span>
            </div>
            <div>总计算资源 CU</div>
            <div>
              <span>{data?.task_cu * data?.task_num + data?.job_cu}</span>
              <span tw="text-neut-8 ml-1">
                [ 计算方式：总计算资源 CU=TM 数量 * TM 规格(CU) + JM 规格(CU)]
              </span>
            </div>
          </Grid>
        </div>

        <div>
          <Title>
            <Icon type="light" name="q-networkFill" />
            <span>网络配置信息</span>
          </Title>
          <Grid>
            <div>网络配置</div>
            <div>
              <div>
                <span>{data?.name}</span>
                <span tw="text-neut-8">{`(${data?.network_id})`}</span>
              </div>
              {data?.network_info && (
                <>
                  <div>
                    <span tw="text-neut-8 mr-1">VPC 网络：</span>
                    <TextLink
                      style={{ fontWeight: 'bold' }}
                      href={`/${regionId}/routers/${data?.network_info?.router_id}`}
                      target="_blank"
                    >
                      {data?.network_info?.router_id}
                    </TextLink>
                  </div>

                  <div>
                    <span tw="text-neut-8 mr-1">私有网络：</span>
                    <TextLink
                      style={{ fontWeight: 'bold' }}
                      href={`/${regionId}/routers/${data?.network_info?.vxnet_id}`}
                      target="_blank"
                    >
                      {data?.network_info?.vxnet_id}
                    </TextLink>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </div>
        <div>
          <Title>
            <Icon type="light" name="if-book" />
            <span>日志配置信息</span>
          </Title>
          <Grid>
            <div>日志级别</div>
            <div>
              {
                logs.find(
                  (i) => i.value === data?.config?.logger?.root_log_level
                )?.label
              }
            </div>
          </Grid>
        </div>

        <div>
          <Title>
            <Icon type="light" name="q-folderSettingFill" />
            <span>可选配置信息</span>
          </Title>
          <Grid>
            <div>Host 别名</div>
            <div>
              {data?.host_alias?.map((i: { ip: string; hostname: string }) => (
                <div key={i.ip}>
                  <span>{i.ip}</span>
                  <span tw="ml-2">{i.hostname}</span>
                </div>
              ))}
            </div>
            <div>
              <AffixLabel
                required={false}
                help={
                  <div>
                    Flink 参数
                    <TextLink
                      href="https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/config/"
                      color="white"
                      tw="ml-1"
                    >
                      参考链接
                    </TextLink>
                  </div>
                }
              >
                Flink 参数
              </AffixLabel>
            </div>
            <div>
              {data?.config?.custom?.map(
                (i: { key: string; value: string }) => (
                  <div key={i.key}>{`${i.key}:${i.value}`}</div>
                )
              )}
            </div>
          </Grid>
        </div>
        <div>
          <Title>
            <Icon type="light" name="q-rmbCircleFill" />
            <span>租赁信息</span>
          </Title>
          <Grid>
            <div>计费方式</div>
            <div>按需计费</div>
            <div>开始计费时间</div>
            <div>
              {dayjs(data?.created * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div>停止计费时间</div>
            <div>使用中</div>
            <div>价格</div>
            <div tw="flex gap-1">
              <span tw="text-green-11">￥0</span>
              <del>¥0 0.281</del>
              <span>每小时</span>
              <span tw="ml-1 text-[#B24B06]">限时免费</span>
            </div>
          </Grid>
        </div>
      </Context>
    </div>
  )
}

export default Cluster
