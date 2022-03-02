import { useMemo } from 'react'
import { useMount, useLocalStorage } from 'react-use'
import { observer } from 'mobx-react-lite'
import tw, { css, theme } from 'twin.macro'
import { useStore } from 'stores'
import { Center, FlexBox } from 'components'
import emitter from 'utils/emitter'
import JobMenu from './JobMenu'
import JobTabs from './JobTabs'

const RealTime = observer(() => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const [sideCollapsed, setSideCollapsed] = useLocalStorage(
    'NAV_SIDER_COLLAPSED',
    false
  )

  useMount(() => {
    if (!sideCollapsed) {
      setSideCollapsed(true)
      emitter.emit('cancelSaveJob')
    }
  })

  const steps = useMemo(
    () => [
      '创建作业',
      '编辑 SQL',
      '测试运行',
      '提交、发布',
      '查看任务以及运维',
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
                  border-${reverse ? 'right' : 'left'}: 4px solid ${theme(
                  'colors.line.dark'
                )};
                `,
              ]}
            />
          </Center>
        )}
      </Center>
    )
  }

  return (
    <div tw="flex min-h-[600px] w-full h-full overflow-auto p-2 pr-0 ">
      <div tw="flex w-full">
        <JobMenu tw="mr-2" />
        {curJob ? (
          <JobTabs />
        ) : (
          <Center tw="flex-1 w-full text-neut-8 bg-neut-18 rounded">
            <div tw="space-y-2">
              <FlexBox tw="space-x-1">
                {steps
                  .slice(0, 3)
                  .map((step, i) => renderStep(step, i, i !== 2))}
              </FlexBox>
              <FlexBox tw="justify-end">
                <div tw="flex flex-col items-center pr-5">
                  <div tw="border-l border-neut-13 h-16" />
                  <div
                    tw="w-0 h-0"
                    css={`
                      border-left: 4px solid transparent;
                      border-right: 4px solid transparent;
                      border-top: 4px solid ${theme('colors.line.dark')};
                    `}
                  />
                </div>
              </FlexBox>
              <FlexBox tw="space-x-1 flex-row-reverse">
                {steps
                  .slice(3)
                  .map((step, i) => renderStep(step, i + 3, i + 3 !== 4, true))}
              </FlexBox>
            </div>
          </Center>
        )}
      </div>
    </div>
  )
})

export default RealTime
