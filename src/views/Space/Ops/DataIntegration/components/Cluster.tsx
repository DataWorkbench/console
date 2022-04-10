import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { styled } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { AffixLabel, TextLink } from 'components'
import React from 'react'

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

const Cluster = ({ data }: { data: Record<string, any> }) => {
  console.log(data)
  return (
    <div tw="w-full border border-line-dark">
      <Header>
        <Icon name="pod" size={40} type="light" />
        <div tw="ml-3">
          <div tw="text-white font-semibold">计算集群</div>
          <div tw="text-neut-8">id:sdfsdf</div>
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
            <div>FixedDelay: 固定延迟</div>
            <div>尝试重启次数</div>
            <div>2</div>
            <div>重启时间间隔</div>
            <div>30s</div>
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
            <div>2a111</div>
            <div>TM 规格</div>
            <div>
              <span tw="text-white">e</span>
              <span tw="text-neut-8">（每 CU：1核 4G）</span>
            </div>
            <div>JM 规格</div>
            <div>
              <span tw="text-white">e</span>
              <span tw="text-neut-8">（每 CU：1核 4G）</span>
            </div>
            <div>总计算资源 CU</div>
            <div>
              <span>=8</span>
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
              <div>网络配置名称 test02item</div>
              <div>
                <span tw="text-neut-8 mr-1">VPC 网络：</span>
                <TextLink
                  style={{ fontWeight: 'bold' }}
                  // href={`/${regionId}/routers/${v}`}
                  target="_blank"
                >
                  test02item
                </TextLink>
              </div>
              <div>
                <span tw="text-neut-8 mr-1">私有网络：</span>
                <TextLink
                  style={{ fontWeight: 'bold' }}
                  // href={`/${regionId}/routers/${v}`}
                  target="_blank"
                >
                  test02item
                </TextLink>
              </div>
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
            <div>DEBUG：调试级别</div>
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
              <div>192.168.3.2 proxy.mgmt.pitrix.yunify.com</div>
              <div>192.168.3.2 proxy.mgmt.pitrix.yunify.com</div>
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
              <div>key01:value01</div>
              <div>key01:value01</div>
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
            <div />
            <div>停止计费时间</div>
            <div>使用中</div>
            <div>价格</div>
            <div>
              <span>¥0 0.281 每小时</span>
              <span tw="ml-1 text-[#B24B06]">限时免费</span>
            </div>
          </Grid>
        </div>
      </Context>
    </div>
  )
}

export default Cluster
