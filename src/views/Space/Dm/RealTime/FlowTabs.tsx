import { useState, useEffect } from 'react'
import { Tabs, Icon } from '@QCFE/lego-ui'
import { Button } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import { useToggle } from 'react-use'
import { findIndex, get } from 'lodash-es'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useStore } from 'stores'
import tw, { css, styled } from 'twin.macro'
import FlowPainter from './FlowPainter'
import NodeMenu from './NodeMenu'

const { TabPanel } = Tabs

const DarkButton = styled('button')(() => [
  tw`inline-flex items-center justify-center border border-neut-13 rounded-sm bg-neut-16 text-white`,
  tw`space-x-2 px-3 h-8`,
])

const TabWrapper = styled(Tabs)(() => [
  tw`bg-neut-18 h-full rounded-md flex flex-col`,
  css`
    .tab-content {
      ${tw`flex-1 py-0!`}
      .tab-panel {
        ${tw`flex h-full`}
      }
    }
  `,
])

const propTypes = {}

function FlowTabs() {
  const [panels, setPanels] = useState([])
  const [showNodeMenu, toggleNodeMenu] = useToggle(false)

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
      <div tw="flex-1 py-4 relative">
        <TabWrapper
          type="card"
          activeName={curFlow.id}
          onChange={(name) => workFlowStore.setCurFlow(name)}
          onClose={(name) => closePanel(name)}
        >
          {panels.map((flow) => (
            <TabPanel key={flow.id} name={flow.id} closable label={flow.id}>
              <div tw="text-white flex-1 flex flex-col">
                <div tw="flex px-2 pt-4 space-x-2">
                  <div tw="relative">
                    <DarkButton onClick={toggleNodeMenu}>
                      <div tw="mr-2">
                        <Icon name="apps" type="light" tw="align-middle" />
                        <span>节点库</span>
                      </div>
                      <Icon name="caret-down" type="light" />
                    </DarkButton>
                  </div>
                  <DarkButton>
                    <Icon name="eye" type="dark" />
                    <span>预览</span>
                  </DarkButton>
                  <DarkButton>
                    <Icon name="remark" type="dark" />
                    <span>语法检查</span>
                  </DarkButton>
                  <DarkButton>
                    <Icon name="start" type="light" />
                    <span>运行</span>
                  </DarkButton>
                  <DarkButton>
                    <Icon name="data" type="dark" />
                    <span>保存</span>
                  </DarkButton>
                  <Button type="primary">
                    <Icon name="export" />
                    <span>发布</span>
                  </Button>
                </div>
                <div tw="flex-1">
                  <FlowPainter />
                </div>
              </div>
            </TabPanel>
          ))}
        </TabWrapper>
        <div tw="pt-2 absolute top-28 left-2 bottom-8 min-h-[450px]  overflow-y-auto">
          <NodeMenu show={showNodeMenu} />
        </div>
      </div>
    </DndProvider>
  )
}

FlowTabs.propTypes = propTypes

export default observer(FlowTabs)
