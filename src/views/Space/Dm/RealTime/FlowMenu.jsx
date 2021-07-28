import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useParams } from 'react-router-dom'
import { Icon, Input } from '@QCFE/qingcloud-portal-ui/lib/components'
import clsx from 'clsx'
import { useStore } from 'stores'

const propTypes = {
  onCreateClick: PropTypes.func,
}

const defaultPropTypes = {
  onCreateClick() {},
}

function FlowMenu({ onCreateClick }) {
  const { space } = useParams()
  const {
    workFlowStore,
    workFlowStore: { flows, curFlow },
  } = useStore()

  useEffect(() => {
    workFlowStore.load({ space }, true)
  }, [space, workFlowStore])

  const handleItemClick = (flow) => {
    workFlowStore.set({ curFlow: flow })
  }

  return (
    <div className="tw-w-56 tw-bg-neutral-N16 tw-m-3 tw-rounded dark:tw-text-white">
      <div
        className={clsx(
          'tw-flex tw-justify-between tw-items-center tw-h-11 tw-px-2 tw-border-b',
          'dark:tw-border-neutral-N15'
        )}
      >
        <span className="tw-text-xs tw-font-semibold">业务流程</span>
        <div className="tw-flex tw-items-center">
          <Icon name="add" type="light" />
          <Icon name="refresh" type="light" />
        </div>
      </div>
      <div className={clsx('tw-border-b', 'dark:tw-border-neutral-N15')}>
        <div className="tw-mt-3 tw-px-2 tw-flex tw-items-center">
          <Input
            className="dark:tw-bg-neutral-N17 dark:tw-text-white dark:tw-border-neutral-N13 dark:hover:tw-border-neutral-N13"
            type="text"
            placeholder="搜索任务关键词/创建人"
          />
          <Icon
            className="tw-ml-2 tw-cursor-pointer"
            name="filter"
            changeable
            type="light"
          />
        </div>
        <div className="tw-mx-2 tw-mt-3 tw-bg-neutral-N17 tw-p-2">
          <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-neutral-N13 tw-pb-1">
            <span>👋️ 快速上手文档</span>
            <Icon name="close" type="light" />
          </div>
          <ul className="tw-pt-2">
            <li>
              <Icon name="file" className="tw-align-middle" />
              <span className="tw-align-middle tw-text-neutral-N8">
                业务流程是什么？
              </span>
            </li>
            <li>
              <Icon name="file" className="tw-align-middle" />
              <span className="tw-align-middle tw-text-neutral-N8">
                业务流程的操作指南
              </span>
            </li>
          </ul>
        </div>
        <div className="tw-text-center tw-my-3">
          <button
            type="button"
            onClick={onCreateClick}
            className="tw-py-1 tw-rounded-sm tw-w-48 tw-bg-neutral-N13 focus:tw-outline-none hover:tw-bg-neutral-N10 tw-ring-opacity-50"
          >
            <Icon name="add" type="light" className="tw-align-middle" />
            <span className="tw-align-middle">创建业务流程</span>
          </button>
        </div>
      </div>
      <div className="tw-pt-4">
        {flows.length > 0 &&
          flows.map((flow) => (
            <div
              key={flow.id}
              className={clsx(
                'tw-leading-8 tw-pl-3 tw-cursor-pointer',
                curFlow && curFlow.id === flow.id
                  ? 'tw-bg-brand-G11'
                  : 'hover:tw-bg-neutral-N13'
              )}
              onClick={() => handleItemClick(flow)}
            >
              <Icon
                name="caret-right"
                type="light"
                className="tw-align-middle"
              />
              <span className="tw-ml-1">{flow.name}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

FlowMenu.propTypes = propTypes
FlowMenu.defaultPropTypes = defaultPropTypes

export default observer(FlowMenu)
