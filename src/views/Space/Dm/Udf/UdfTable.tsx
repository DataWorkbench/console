import { Alert } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import { Table } from 'views/Space/styled'

import TableToolBar from './TableToolBar'

const dataSource = [
  {
    image_id: 'arch201310x64',
    image_name: 'Arch Linux 2013.10 64bit',
    platform: 'linux',
    size: 20,
    status: 'available',
  },
  {
    image_id: 'centos63x64',
    image_name: 'CentOS 6.3 64bit',
    platform: 'linux',
    size: 20,
    status: 'available',
  },
  {
    image_id: 'debian91x64',
    image_name: 'Debian Stretch 9.1 64bit',
    platform: 'linux',
    size: 20,
    status: 'deprecated',
  },
]

const columns = [
  {
    title: 'ID',
    dataIndex: 'image_id',
  },
  {
    title: '名称',
    dataIndex: 'image_name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (field) => (field === 'available' ? '已启用' : '已弃用'),
  },
  {
    title: '容量 (G)',
    dataIndex: 'size',
  },
  {
    title: '平台',
    dataIndex: 'platform',
  },
]

interface IUdfTable {
  tp: 'udf' | 'udtf' | 'udttf'
}

const UdfTable = ({ tp }: IUdfTable) => {
  const [filter] = useImmer({
    current: 0,
    pageSize: 10,
  })
  return (
    <div tw="w-full">
      <Alert message="提示" type="info" tw="bg-neut-16! mb-4" />
      <TableToolBar />
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="image_id"
        title={tp}
        pagination={{
          total: 101,
          current: filter.current,
          pageSize: filter.pageSize,
        }}
      />
    </div>
  )
}

export default UdfTable
