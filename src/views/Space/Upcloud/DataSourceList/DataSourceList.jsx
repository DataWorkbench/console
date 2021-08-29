import React, { useEffect, useState } from 'react'
import { useToggle } from 'react-use'
import { observer } from 'mobx-react-lite'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  PageTab,
  Icon,
  Button,
  Loading,
  Table,
  Message,
  ToolBar,
  ToolBarLeft,
} from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import DataSourceModal from './DataSourceModal'

const tabs = [
  {
    title: '数据源',
    description:
      '数据源主要用于数据集成过程中 Reader 和 Writer 的对象，您可以在数据源管理页面查看、新增及批量新增数据源。指定的整个数据库全部或者部分表一次性的全部同步至MySQL，并且支持后续的实时增量同步模式，将新增数据持续同步至 MySQL。',
    icon: 'blockchain',
    helpLink: '/',
  },
]
const columns = [
  {
    title: '数据源名称/id',
    dataIndex: 'id',
    render: (v, row) => (
      <div>
        <div>{row.name}</div>
        <div className="tw-text-neut-8">{v}</div>
      </div>
    ),
  },
  {
    title: '数据源类型',
    dataIndex: 'enginetype',
  },
  {
    title: 'url',
    render: (v, row) => {
      const {
        url: { host, port },
      } = row
      return (
        <span>
          {host}:{port}
        </span>
      )
    },
  },
  {
    title: '用户名',
    dataIndex: 'creator',
  },
  {
    title: '数据源描述',
    dataIndex: 'comment',
  },
  {
    title: '创建时间',
    dataIndex: 'updatetime',
    render: (field) => dayjs(field).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '操作',
    key: 'table_actions',
    dataIndex: '',
    width: 130,
    render: () => (
      <div>
        <Button type="text" className="tw-px-1 !tw-text-link">
          表
        </Button>
        <Button type="text" className="tw-px-1 !tw-text-link">
          编辑
        </Button>
        <Button type="text" className="tw-px-1 !tw-text-link">
          删除
        </Button>
      </div>
    ),
  },
]

function DataSourceList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, toggleLoadding] = useState(true)
  const [show, toggleShow] = useToggle(false)
  const { spaceId } = useParams()
  const {
    dataSourceStore,
    dataSourceStore: { sourceInfoList },
  } = useStore()
  useEffect(() => {
    toggleLoadding(true)
    dataSourceStore.load(spaceId, true).finally(() => {
      toggleLoadding(false)
    })
  }, [spaceId, dataSourceStore])
  return (
    <div
      className={clsx(
        'tw-rounded-sm tw-m-5 tw-flex-1',
        sourceInfoList.length === 0 && 'tw-min-h-[400px] tw-bg-white'
      )}
    >
      <Loading spinning={loading}>
        {sourceInfoList.length ? (
          <div className="tw-pb-3">
            <PageTab tabs={tabs} />

            <ToolBar className="tw-bg-white">
              <ToolBarLeft>
                <Button type="primary" onClick={() => toggleShow(true)}>
                  <Icon name="add" />
                  新增数据源
                </Button>
                <Button
                  type="default"
                  disabled
                  onClick={() => Message.info('删除')}
                >
                  <Icon name="add" />
                  删除
                </Button>
              </ToolBarLeft>
            </ToolBar>
            <Table
              selectType="checkbox"
              dataSource={sourceInfoList}
              columns={columns}
              rowKey="id"
              selectedRowKeys={selectedRowKeys}
              onSelect={(rowKeys) => setSelectedRowKeys(rowKeys)}
            />
          </div>
        ) : (
          <div className=" tw-pt-20 tw-pb-20 ">
            <div className="tw-text-center tw-mx-auto tw-w-9/12">
              <Icon name="blockchain" size={60} className="tw-mb-3" />
              <div className="tw-mb-3 tw-font-medium tw-text-xl">
                暂无数据源
              </div>
              <p className="tw-mx-auto tw-mb-3 tw-w-3/5 tw-text-neut-8">
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
        )}
      </Loading>

      {show && <DataSourceModal show={show} onHide={() => toggleShow(false)} />}
    </div>
  )
}

export default observer(DataSourceList)
