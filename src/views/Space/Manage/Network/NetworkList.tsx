import { Table } from '@QCFE/qingcloud-portal-ui'
import { networkColumns } from 'views/Space/Manage/Network/common/constants'
import tw, { styled } from 'twin.macro'
import { Tooltip, Center } from 'components'
import { useColumns } from 'hooks/useHooks/useColumns'

interface INetworkProps {
  settingKey: string
}

const TableWrapper = styled.div`
  .grid-table-header .table-thead {
    ${tw`font-semibold`}
  }
`
const Tag = styled.div`
  ${tw`inline-flex items-center h-4 text-icon-single-info px-2 bg-info-light border rounded border-info-light`}
`
export default function NetworkList(props: INetworkProps) {
  const { settingKey } = props

  const operation = {
    title: '',
    dataIndex: 'operation',
    key: 'operation',
    render: () => {
      return (
        <Center>
          <Tooltip
            hasPadding
            content="默认私有网络暂不支持移除、更换（如需彻底释放，请删除工作空间）"
            theme="instead"
          >
            <Tag>默认</Tag>
          </Tooltip>
        </Center>
      )
    },
  }
  const { columns } = useColumns(settingKey, networkColumns, {}, operation)
  return (
    <TableWrapper>
      <Table columns={columns} dataSource={[{}]} />
    </TableWrapper>
  )
}
