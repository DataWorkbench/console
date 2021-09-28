import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css } from 'twin.macro'
import { useStore } from 'stores'
import { Center, FlexBox } from 'components'
import FlowMenu from './FlowMenu'
import FlowTabs from './FlowTabs'
import FlowModal from './FlowModal'

const RealTime = observer(() => {
  const {
    workFlowStore: { curFlow },
  } = useStore()

  const steps = useMemo(
    () => [
      '新建业务流程',
      '新建表',
      '新建节点',
      '编辑节点',
      '测试运行并设置调度',
      '提交、发布节点',
      '生产环境查看任务',
    ],
    []
  )

  const renderStep = (
    step: string,
    i: number,
    hasArrow = true,
    reverse = false
  ) => {
    return (
      <Center key={step} css={[reverse && tw`flex-row-reverse`]}>
        <Center>
          <div tw="inline-flex justify-center items-center bg-neut-16  rounded-full w-4 h-4 mr-2">
            {i + 1}
          </div>
          <div>{step}</div>
        </Center>
        {hasArrow && (
          <Center css={[tw`px-2`, reverse && tw`flex-row-reverse`]}>
            <div tw="border-t border-neut-13 w-12" />
            <div
              tw="w-0 h-0"
              css={[
                css`
                  border-top: 4px solid transparent;
                  border-bottom: 4px solid transparent;
                  border-${reverse ? 'right' : 'left'}: 4px solid #4c5e70;
                `,
              ]}
            />
          </Center>
        )}
      </Center>
    )
  }

  return (
    <div tw="flex min-h-[600px] h-full overflow-auto p-3 space-x-3">
      <FlowMenu />
      {curFlow ? (
        <FlowTabs />
      ) : (
        <Center tw="flex-1 text-neut-8 bg-neut-18 rounded">
          <div tw="space-y-2">
            <FlexBox tw="space-x-1">
              {steps.slice(0, 4).map((step, i) => renderStep(step, i, i !== 3))}
            </FlexBox>
            <FlexBox tw="justify-end">
              <div tw="flex flex-col items-center pr-5">
                <div tw="border-l border-neut-13 h-16" />
                <div
                  tw="w-0 h-0"
                  css={`
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-top: 4px solid #4c5e70;
                  `}
                />
              </div>
            </FlexBox>
            <FlexBox tw="space-x-1 flex-row-reverse">
              {steps
                .slice(4)
                .map((step, i) => renderStep(step, i + 4, i + 4 !== 6, true))}
            </FlexBox>
          </div>
        </Center>
      )}
      <FlowModal />
    </div>
  )
})

export default RealTime
