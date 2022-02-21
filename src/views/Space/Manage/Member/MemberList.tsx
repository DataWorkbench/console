import { Icon, PageTab, Table } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import { Card, Center, TextEllipsis } from 'components'
import tw, { css, styled } from 'twin.macro'
import MemberModal from 'views/Space/Manage/Member/MemberModal'
import { observer } from 'mobx-react-lite'
import { memberTabs } from './constants'
import MemberTableBar from './MemberTableBar'
import { useMemberStore } from './store'

const columns = [
  {
    title: '成员名称/ID',
    dataIndex: 'id',
    key: 'id',
    render: (text: string, record: Record<string, any>) => {
      return (
        <FlexBox tw="items-center truncate space-x-2">
          <Center tw="bg-[#E2E8F0] rounded-full w-6 h-6">
            <Icon name="human" type="dark" size={16} />
          </Center>
          <div tw="flex-1 break-all truncate">
            <div tw="truncate table-instance-name">
              <TextEllipsis>{record.name}</TextEllipsis>
            </div>
            <div tw="truncate table-instance-id">
              <TextEllipsis>{record.id}</TextEllipsis>
            </div>
          </div>
        </FlexBox>
      )
    },
  },
  {
    title: '成员邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '账户类型',
    dataIndex: 'account_type',
    key: 'account_type',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: '加入时间',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: '操作',
    key: 'option',
  },
]

const Root = styled('div')(() => [
  tw`h-full flex flex-col`,
  css`
    .page-tab-container {
      margin-bottom: 20px;
    }
  `,
])

const Member = observer(() => {
  const { op } = useMemberStore()

  return (
    <Root>
      <PageTab tabs={memberTabs} />
      <div tw="bg-white rounded">
        <MemberTableBar />
        <Card tw="flex-1 pb-5 px-5">
          <Table
            dataSource={[
              {
                id: '1',
                name: 'test',
                email: '',
              },
            ]}
            columns={columns}
            rowKey="id"
          />
        </Card>
      </div>
      {new Set(['edit', 'add', 'detail']).has(op) && <MemberModal />}
    </Root>
  )
})
export default Member
