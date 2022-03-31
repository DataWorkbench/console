import { Collapse } from '@QCFE/lego-ui'
import { Button, Icon } from '@QCFE/qingcloud-portal-ui'
import { HelpCenterLink, FieldMappings } from 'components'
import tw, { css, styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import { JobToolBar } from '../styled'
import SyncDataSource from './SyncDataSource'

const { CollapseItem } = Collapse
const CollapseWrapper = styled('div')(() => [
  tw`flex-1 px-2 py-2 bg-neut-18`,
  css`
    li.collapse-item {
      ${tw`mt-2 rounded-[3px] overflow-hidden`}
      .collapse-transition {
        ${tw`transition-none`}
      }
      .collapse-item-label {
        ${tw`h-11 border-none hover:bg-neut-16`}
      }
      .collapse-item-content {
        ${tw`bg-neut-17`}
      }
    }
  `,
])

const styles = {
  stepTag: tw`flex items-center text-left border border-green-11 rounded-r-2xl pr-4 mr-3 h-7 leading-5`,
  stepNum: tw`inline-block text-white bg-green-11 w-5 h-5 text-center rounded-full -ml-2.5`,
  stepText: tw`ml-2 inline-block border-green-11 text-green-11`,
}

const stepsData = [
  {
    key: 'p0',
    title: '选择数据源',
    desc: (
      <>
        在这里配置数据的来源端和目的端；仅支持在
        <HelpCenterLink
          hasIcon
          isIframe={false}
          href="/xxx"
          onClick={(e) => e.stopPropagation()}
        >
          数据源管理
        </HelpCenterLink>
        创建的数据源。
      </>
    ),
  },
  {
    key: 'p1',
    title: '字段映射',
    desc: null,
  },
  {
    key: 'p2',
    title: '计算集群',
    desc: <>数据来源、目的、计算集群不在同一 VPC？请前往</>,
  },
  {
    key: 'p3',
    title: '通道控制',
    desc: <>您可以配置作业的传输速率和错误记录来控制整个数据同步过程</>,
  },
]

const SyncJob = () => {
  const [fields, setFields] = useImmer<{
    source: Record<string, any>[]
    target: Record<string, any>[]
  }>({
    source: [],
    target: [],
  })
  // console.log('fields', fields)
  return (
    <div tw="flex flex-col flex-1">
      <JobToolBar>
        <Button type="black">
          <Icon name="coding" type="light" />
          脚本模式
        </Button>
        <Button>
          <Icon name="data" type="dark" />
          保存
        </Button>
        <Button type="primary">
          <Icon name="export" />
          发布
        </Button>
      </JobToolBar>

      <CollapseWrapper>
        <Collapse defaultActiveKey={stepsData.map((step) => step.key)}>
          {stepsData.map(({ key, title, desc }, index) => (
            <CollapseItem
              key={key}
              label={
                <>
                  <div css={styles.stepTag}>
                    <span css={styles.stepNum}>{index + 1}</span>
                    <span css={styles.stepText}>{title}</span>
                  </div>
                  <div tw="text-neut-13">{desc}</div>
                </>
              }
            >
              {index === 0 && (
                <SyncDataSource
                  onFetchedFields={(
                    tp: 'source' | 'target',
                    data: Record<string, any>[]
                  ) => {
                    setFields((draft) => {
                      if (tp === 'source') {
                        draft.source = data || []
                      } else {
                        draft.target = data || []
                      }
                    })
                  }}
                />
              )}
              {index === 1 && (
                <FieldMappings
                  leftFields={fields.source}
                  rightFields={fields.target}
                  topHelp={
                    <HelpCenterLink href="/xxx" isIframe={false}>
                      字段映射说明文档
                    </HelpCenterLink>
                  }
                />
              )}
              {index === 2 && <>3</>}
              {index === 3 && <>4</>}
            </CollapseItem>
          ))}
        </Collapse>
      </CollapseWrapper>
    </div>
  )
}

export default SyncJob
