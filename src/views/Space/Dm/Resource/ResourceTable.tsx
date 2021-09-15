import { Table } from '@QCFE/qingcloud-portal-ui'
import { styled, css, theme } from 'twin.macro'
import TableToolBar from './TableToolBar'

const dataSource = [
  {
    image_id: 'arch201310x64',
    image_name: 'Arch Linux 2013.10 64bit',
    platform: 'linux',
    size: 20,
    status: 'available',
    update: 'xx',
  },
  {
    image_id: 'centos63x64',
    image_name: 'CentOS 6.3 64bit',
    platform: 'linux',
    size: 20,
    status: 'available',
    update: 'xx',
  },
  {
    image_id: 'debian91x64',
    image_name: 'Debian Stretch 9.1 64bit',
    platform: 'linux',
    size: 20,
    status: 'deprecated',
    update: 'xx',
  },
]

const columns = [
  {
    title: '资源包名称',
    dataIndex: 'image_id',
  },
  {
    title: '类型',
    dataIndex: 'image_name',
  },
  {
    title: '文件大小',
    dataIndex: 'status',
    render: (field) => (field === 'available' ? '已启用' : '已弃用'),
  },
  {
    title: '描述',
    dataIndex: 'size',
  },
  {
    title: '上传时间',
    dataIndex: 'platform',
  },
  {
    title: '操作',
    dataIndex: '',
  },
]

const DarkTable = styled(Table)(
  () => css`
    color: #fff;
    .grid-table-header {
      background-color: ${theme('colors.neut.17')};
      border-bottom: 1px solid ${theme('colors.neut.13')};
      border-radius: 0;
      .table-thead {
        color: #fff;
      }
    }
    .table-row {
      background-color: ${theme('colors.neut.16')};
      border-bottom: 1px solid ${theme('colors.neut.13')};
    }
  `
)

const ResourceTable: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div tw="space-y-3 bg-neut-16 p-5" className={className}>
      <TableToolBar />
      <div tw="text-neut-8">全部文件</div>
      <DarkTable rowKey="image_id" dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default ResourceTable
