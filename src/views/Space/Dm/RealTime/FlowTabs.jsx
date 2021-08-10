import React, { useState, useEffect } from 'react'
import { Tabs, Icon } from '@QCFE/lego-ui'
import { Button } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react'
import { useToggle } from 'react-use'
import clsx from 'clsx'
import { findIndex, get } from 'lodash'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import { useStore } from 'stores'
import FlowPainter from './FlowPainter'
import NodeMenu from './NodeMenu'
import styles from './styles.module.css'

const { TabPanel } = Tabs

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
      <div className="tw-flex-1 tw-py-4 tw-relative">
        <Tabs
          type="card"
          activeName={curFlow.id}
          className={clsx(
            'tw-bg-neut-18 tw-h-full tw-rounded-md tw-flex tw-flex-col',
            styles.tabWrapper
          )}
          onChange={(name) => workFlowStore.setCurFlow(name)}
          onClose={(name) => closePanel(name)}
        >
          {panels.map((flow) => (
            <TabPanel key={flow.id} name={flow.id} closable label={flow.id}>
              <div className="tw-text-white tw-flex-1 tw-flex tw-flex-col">
                <div className="tw-flex tw-px-2 tw-pt-3">
                  <div className="tw-relative">
                    <button
                      type="button"
                      className={clsx(styles.btn, 'tw-flex tw-justify-between')}
                      onClick={toggleNodeMenu}
                    >
                      <div className="tw-mr-2">
                        <Icon
                          name="apps"
                          type="light"
                          className="tw-align-middle"
                        />
                        <span>节点库</span>
                      </div>
                      <Icon name="caret-down" type="light" />
                    </button>
                  </div>
                  <button type="button" className={styles.btn}>
                    <Icon name="eye" type="dark" />
                    <span>预览</span>
                  </button>
                  <button type="button" className={styles.btn}>
                    <Icon name="remark" type="dark" />
                    <span>语法检查</span>
                  </button>
                  <button type="button" className={styles.btn}>
                    <Icon name="start" type="light" />
                    <span>运行</span>
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      styles.btn,
                      'tw-bg-neut-13 hover:tw-bg-neut-15'
                    )}
                  >
                    <Icon name="data" type="dark" />
                    <span>保存</span>
                  </button>
                  <Button type="primary">
                    <Icon name="export" />
                    <span>发布</span>
                  </Button>
                </div>
                <div className="tw-flex-1">
                  <FlowPainter />
                </div>
              </div>
            </TabPanel>
          ))}
        </Tabs>
        <div className="tw-pt-2 tw-absolute tw-top-28 tw-left-2 tw-bottom-8 tw-min-h-[450px]  tw-overflow-y-auto">
          <NodeMenu show={showNodeMenu} />
        </div>
      </div>
    </DndProvider>
  )
}

FlowTabs.propTypes = propTypes

export default observer(FlowTabs)
