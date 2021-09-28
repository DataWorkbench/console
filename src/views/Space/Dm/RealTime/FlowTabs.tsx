import { useState, useEffect } from 'react'
import { Tabs } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { findIndex, get } from 'lodash-es'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useStore } from 'stores'
import tw, { css, styled } from 'twin.macro'
import StreamOperator from './StreamOperator'
import StreamSQL from './StreamSQL'

const { TabPanel } = Tabs

const TabWrapper = styled(Tabs)(() => [
  tw`bg-neut-18 h-full rounded-md flex flex-col`,
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
      ${tw`flex-1 py-0!`}
      .tab-panel {
        ${tw`flex h-full`}
      }
    }
  `,
])

const FlowTabs = observer(() => {
  const [panels, setPanels] = useState([])

  const {
    workFlowStore,
    workFlowStore: { curFlow },
  } = useStore()

  useEffect(() => {
    if (curFlow) {
      const idx = findIndex(panels, (p) => p.id === curFlow.id)
      if (idx === -1) {
        setPanels((p) => [...p, curFlow])
      }
    }
  }, [curFlow, panels])

  const closePanel = (name) => {
    const filterPanels = panels.filter((panel) => panel.id !== name)
    setPanels(filterPanels)
    const len = filterPanels.length
    if (len === 0) {
      workFlowStore.set({ curFlow: null })
    } else if (get(curFlow, 'id') === name) {
      workFlowStore.set({ curFlow: filterPanels[len - 1] })
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div tw="flex-1 relative">
        <TabWrapper
          type="card"
          activeName={curFlow.id}
          onChange={(name) => workFlowStore.setCurFlow(name)}
          onClose={(name) => closePanel(name)}
        >
          {panels.map((flow) => (
            <TabPanel key={flow.id} name={flow.id} closable label={flow.id}>
              {(() => {
                if (curFlow.type === 1) {
                  return <StreamSQL tw="flex-1 h-full" />
                }
                if (curFlow.type === 3) {
                  return <StreamOperator tw="flex-1 h-full" />
                }
                return null
              })()}
            </TabPanel>
          ))}
        </TabWrapper>
      </div>
    </DndProvider>
  )
})

export default FlowTabs
