import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Button,
  Input,
  Control,
  RadioButton,
  RadioGroup,
  Tooltip,
} from '@QCFE/lego-ui'
import { Icon, Table } from '@QCFE/qingcloud-portal-ui'
import SpaceItem from './SpaceItem'
// import Modal from './Modal'
import CreateModal from './CreateModal'
import styles from './styles.module.css'

const optMenu = (
  <div>
    <ul>
      <li className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neutral-N15 ">
        <Icon name="blockchain" />
        数据源管理
      </li>
      <li className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neutral-N15">
        <Icon name="blockchain" />
        网络连通工具
      </li>
      <li className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neutral-N15">
        <Icon name="blockchain" />
        整库迁移
      </li>
    </ul>
  </div>
)

function renderCardView(data) {
  return data.map((ws, i) => {
    return (
      <div key={ws.id} className={`${styles.workspace} tw-w-1/2`}>
        <SpaceItem data={ws} className={styles[`ws_${i % 5}`]} />
      </div>
    )
  })
}

function renderTableView(data) {
  const columns = [
    { title: '空间名称/id', dataIndex: 'title' },
    { title: '空间状态', dataIndex: 'status' },
    { title: '管理员', dataIndex: 'owner' },
    { title: '工作流数', dataIndex: 'numbers' },
    { title: '描述', dataIndex: 'subtitle' },
    { title: '创建时间', dataIndex: 'ctime' },
    {
      title: '操作',
      dataIndex: 'name',
      width: 220,
      render: () => (
        <div className="tw-flex">
          <Tooltip className="tw-p-0" content={optMenu} placement="bottomRight">
            <button type="button" className={clsx(styles.btn, styles.gridBtn)}>
              数据上云
            </button>
          </Tooltip>
          <Tooltip className="tw-p-0" content={optMenu} placement="bottomRight">
            <button type="button" className={clsx(styles.btn, styles.gridBtn)}>
              数据上云
            </button>
          </Tooltip>
        </div>
      ),
    },
  ]
  return (
    <div>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          total: 50,
          current: 1,
          pageSize: 10,
        }}
      />
    </div>
  )
}

const SpaceLists = ({ className, dataSource }) => {
  const [viewType, setViewType] = useState('cardView')
  const [showCreateModal, setShowOpenCreateModal] = useState(false)
  return (
    <div className={className}>
      <div className="tw-flex tw-justify-between tw-mb-5 ">
        <div>
          <Button
            type="primary"
            className="tw-font-medium tw-px-5"
            onClick={() => setShowOpenCreateModal(true)}
          >
            创建工作空间
          </Button>
        </div>
        <div className="tw-flex tw-items-stretch">
          <Control className="has-icons-left tw-mr-2">
            <Icon className="is-left" name="magnifier" />
            <Input type="text" placeholder="请输入工作名称/ID" />
          </Control>
          <Button className="tw-mr-2">
            <Icon name="if-refresh" className="tw-text-xl" />
          </Button>
          <Button className="tw-mr-2">
            <Icon name="if-column" className="tw-text-base" />
          </Button>
          <div className="tw-border-l tw-border-neutral-N3 tw-mr-2" />
          <RadioGroup
            name="states"
            defaultValue={viewType}
            onChange={(v) => setViewType(v)}
          >
            <RadioButton value="cardView">卡片视图</RadioButton>
            <RadioButton value="listView">列表视图</RadioButton>
          </RadioGroup>
        </div>
      </div>
      {viewType === 'cardView' ? (
        <div className="tw-flex tw-flex-wrap">{renderCardView(dataSource)}</div>
      ) : (
        renderTableView(dataSource)
      )}
      {showCreateModal && (
        <CreateModal onHide={() => setShowOpenCreateModal(false)} />
      )}
    </div>
  )
}

SpaceLists.propTypes = {
  className: PropTypes.string,
  dataSource: PropTypes.array,
}

export default SpaceLists
