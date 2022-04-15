import tw, { css, styled } from 'twin.macro'
import { Collapse } from '@QCFE/lego-ui'
import DevContentDataSource from 'views/Space/Ops/DataIntegration/components/DevContent/DevContentDataSource'
import { AffixLabel, FieldMappings } from 'components'
import { pick } from 'lodash-es'

const { CollapseItem } = Collapse

const Grid = styled('div')(() => [
  tw`grid gap-2 leading-[20px] place-content-start`,
  css`
    grid-template-columns: 140px 1fr;

    & > div:nth-of-type(2n + 1) {
      ${tw`text-neut-8`}
    }

    & > div:nth-of-type(2n) {
      ${tw`text-white`}
  `,
])
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

const stepsData = [
  {
    key: 'p0',
    title: '选择数据源',
  },
  {
    key: 'p1',
    title: '字段映射',
    desc: null,
  },

  {
    key: 'p2',
    title: '通道控制',
  },
]

const styles = {
  stepTag: tw`flex items-center text-left border border-green-11 rounded-r-2xl pr-4 mr-3 h-7 leading-5`,
  stepNum: tw`inline-block text-white bg-green-11 w-5 h-5 text-center rounded-full -ml-2.5`,
  stepText: tw`ml-2 inline-block border-green-11 text-green-11`,
}

interface IProps {
  data: Record<string, any>
}

const DevContentUI = (props: IProps) => {
  const { data } = props
  console.log(data)
  return (
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
              <DevContentDataSource />
              // <SyncDataSource
              //   onFetchedFields={(
              //     tp: 'source' | 'target',
              //     data: Record<string, any>[]
              //   ) => {
              //     setFields((draft) => {
              //       if (tp === 'source') {
              //         draft.source = data || []
              //       } else {
              //         draft.target = data || []
              //       }
              //     })
              //   }}
              // />
            )}
            {index === 1 && (
              <div tw="relative">
                <div tw="absolute inset-0 z-50" />
                <FieldMappings
                  leftFields={
                    [{ key: 'aa', name: 'aaa' }].map((field) =>
                      pick(field, ['name', 'type', 'is_primary_key'])
                    ) as any
                  }
                  rightFields={[].map((field) =>
                    pick(field, ['name', 'type', 'is_primary_key'])
                  )}
                  readonly
                  hasHeader={false}
                />
              </div>
            )}
            {index === 2 && (
              <div>
                <Grid>
                  <div>
                    <AffixLabel
                      theme="light"
                      required={false}
                      help="作业期望最大并行数"
                    >
                      作业期望最大并行数
                    </AffixLabel>
                  </div>
                  <div>200</div>
                  <div>
                    <AffixLabel
                      theme="light"
                      required={false}
                      help="作业期望最大并行数"
                    >
                      同步速率
                    </AffixLabel>
                  </div>
                  <div>不限流</div>
                  <div>
                    <AffixLabel theme="light" required={false} help="同步速率">
                      错误记录数超过
                    </AffixLabel>
                  </div>
                  <div> 190% 比例，达到任一条件时，任务自动结束</div>
                </Grid>
              </div>
            )}
          </CollapseItem>
        ))}
      </Collapse>
    </CollapseWrapper>
  )
}

export default DevContentUI
