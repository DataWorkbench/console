import { useEffect, useMemo } from 'react'
import { useUpdateEffect, useUnmount } from 'react-use'
import { Tabs } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { findIndex } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useStore } from 'stores'
import tw, { css, styled } from 'twin.macro'
import StreamOperator from './StreamOperator'
import StreamCode from './StreamCode'
import StreamJAR from './StreamJAR'

const { TabPanel } = Tabs

const TabWrapper = styled(Tabs)(() => [
  tw`bg-neut-18 h-full flex flex-col`,
  css`
    .tabs {
      ${tw`bg-neut-17`};
      ul {
        border: 0;
        li {
          ${tw`(border-none rounded-b-none mx-0.5)!`}
          .tag {
            ${tw`border border-neut-13 text-neut-8 scale-75 bg-transparent`}
          }
          &.is-active {
            ${tw`text-white bg-green-11! hover:(bg-green-11)!`}
            .tag {
              ${tw`text-neut-13 bg-white border-0`}
            }
            > span.icon:hover svg {
              ${tw`text-white!`}
            }
          }
          ${tw`(bg-neut-18  pl-1 pr-3 py-1)! text-white rounded text-xs hover:((text-white bg-neut-16)!)`}
          > span.icon {
            ${tw`ml-2!`}
            svg {
              ${tw`text-white`}
            }
          }
        }
      }
      .tabs-handler {
        ${tw`h-9 bg-gradient-to-r from-neut-15 to-neut-16 bg-opacity-70 rounded-t-sm border-b-0`}
        svg {
          ${tw`text-white`}
        }
      }
    }
    .tab-content {
      ${tw`flex-1 h-full py-0!`}
      .tab-panel {
        ${tw`flex h-full`}
      }
    }
  `,
])

const JobTabs = observer(() => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const {
    workFlowStore,
    workFlowStore: { curJob, panels, addPanel, removePanel },
  } = useStore()

  const added = curJob && findIndex(panels, (p) => p.id === curJob.id) > -1

  useEffect(() => {
    if (!added && curJob) {
      addPanel(curJob)
    }
  }, [curJob, added, addPanel])

  useUpdateEffect(() => {
    workFlowStore.set({ panels: [], curJob: null })
  }, [spaceId, workFlowStore])

  useUnmount(() => {
    workFlowStore.set({ panels: [], curJob: null })
  })

  const showNames: any = useMemo(
    () => ({
      1: '算子',
      2: 'Sql',
      3: 'Jar',
      4: 'Python',
      5: 'Scala',
    }),
    []
  )

  return (
    <div tw="flex-1 w-full overflow-x-hidden relative">
      <TabWrapper
        type="card"
        activeName={curJob?.id}
        onChange={(name) =>
          workFlowStore.set({
            curJob: panels.find((p) => p.id === name),
          })
        }
        onClose={(name: string) => removePanel(name)}
      >
        {panels.map((flow) => (
          <TabPanel
            key={flow.id}
            name={flow.id}
            closable
            label={
              <div tw="inline-flex items-center justify-center">
                <div className="tag">{showNames[flow.type]}</div>
                <div>{flow.name}</div>
              </div>
            }
          >
            {(() => {
              if (flow.type === 1) {
                return (
                  <DndProvider backend={HTML5Backend}>
                    <StreamOperator tw="flex-1 h-full" />
                  </DndProvider>
                )
              }
              if ([2, 4, 5].includes(flow.type)) {
                return <StreamCode tw="flex-1 h-full" tp={flow.type as any} />
              }
              if (flow.type === 3) {
                return <StreamJAR tw="flex-1 h-full" />
              }
              return null
            })()}
          </TabPanel>
        ))}
      </TabWrapper>
    </div>
  )
})

export default JobTabs
