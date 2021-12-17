import { useEffect } from 'react'
import { useUpdateEffect } from 'react-use'
import { Tabs, Icon } from '@QCFE/lego-ui'
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
          ${tw`bg-neut-18! border-0! text-white rounded py-1! text-xs`}
          svg {
            ${tw`text-white`}
          }
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

  return (
    <div tw="flex-1 w-full relative">
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
              <span>
                <Icon name="name-space" />
                {flow.name}
              </span>
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
