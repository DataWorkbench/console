import React from 'react'
import { useToggle } from 'react-use'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import DataSourceModal from './DataSourceModal'

function DataSourceList() {
  const [show, toggleShow] = useToggle(false)
  return (
    <div className="tw-bg-white tw-rounded-sm tw-m-5 tw-flex-1">
      <div className="tw-pt-20 tw-pb-20 tw-mx-auto tw-w-9/12">
        <div className="tw-text-center">
          <Icon name="blockchain" size={60} className="tw-mb-3" />
          <div className="tw-mb-3 tw-font-medium tw-text-xl">暂无数据源</div>
          <p className="tw-mx-auto tw-mb-3 tw-w-3/5 tw-text-neutral-N8">
            数据源主要用于数据集成过程中 Reader 和 Writer
            的对象，您可以在数据源管理页面查看、新增及批量新增数据源。指定的整个数据库全部或者部分表一次性的全部同步至MySQL，并且支持后续的实时增量同步模式，将新增数据持续同步至
            MySQL。
          </p>
          <div>
            <Button className="tw-mr-4">
              <Icon name="if-book" type="light" />
              使用指南
            </Button>
            <Button type="primary" onClick={() => toggleShow(true)}>
              <Icon name="add" type="light" />
              新增数据源
            </Button>
          </div>
        </div>
      </div>
      <DataSourceModal show={show} onHide={() => toggleShow(false)} />
    </div>
  )
}

export default DataSourceList
