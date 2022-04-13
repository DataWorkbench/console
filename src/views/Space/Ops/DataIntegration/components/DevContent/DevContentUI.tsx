import tw, { css, styled } from 'twin.macro'
import { Collapse } from '@QCFE/lego-ui'
import DevContentDataSource from 'views/Space/Ops/DataIntegration/components/DevContent/DevContentDataSource'

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
              <div>2</div>
              // <FieldMappings
              //   leftFields={fields.source.map((field) =>
              //     pick(field, ['name', 'type', 'is_primary_key'])
              //   )}
              //   rightFields={fields.target.map((field) =>
              //     pick(field, ['name', 'type', 'is_primary_key'])
              //   )}
              //   topHelp={
              //     <HelpCenterLink href="/xxx" isIframe={false}>
              //       字段映射说明文档
              //     </HelpCenterLink>
              //   }
              // />
            )}
            {index === 2 && <>3</>}
            {index === 3 && <>4</>}
          </CollapseItem>
        ))}
      </Collapse>
    </CollapseWrapper>
  )
}

export default DevContentUI
