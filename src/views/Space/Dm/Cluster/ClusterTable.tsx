import { useImmer } from 'use-immer'
import { Button, Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center } from 'components'
import { useStore } from 'hooks'
import { Table } from 'views/Space/styled'

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

const ClusterTable = () => {
  const {
    dmStore: { setOP },
  } = useStore()
  const [filter] = useImmer({
    current: 0,
    pageSize: 10,
  })
  return (
    <div tw="w-full">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Button type="primary" onClick={() => setOP('create')}>
              <Icon name="upload" />
              创建集群
            </Button>
            <Button>
              <Icon name="trash" type="light" />
              <span>删除</span>
            </Button>
          </Center>
          <Center tw="space-x-3">
            <InputSearch tw="w-64" placeholder="请输入关键词进行搜索" />
            <Button>
              <Icon name="if-refresh" tw="text-xl text-white" type="light" />
            </Button>
          </Center>
        </FlexBox>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="image_id"
        pagination={{
          total: 101,
          current: filter.current,
          pageSize: filter.pageSize,
        }}
      />
    </div>
  )
}

export default ClusterTable
