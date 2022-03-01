import React, { useCallback, useMemo } from 'react'
import { Icon, PageTab, Table } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import { Card, Center, TextEllipsis } from 'components'
import tw, { css, styled } from 'twin.macro'
import MemberModal from 'views/Space/Manage/Member/MemberModal'
import { observer } from 'mobx-react-lite'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import { Button, Tag } from '@QCFE/lego-ui'
import { emitter } from 'utils/index'
import { useMutationMember, useQueryMemberList, useQueryRoleList } from 'hooks'

import MemberDeleteModal from './MemberDeleteModal'
import { memberTabs } from './constants'
import MemberTableBar from './MemberTableBar'
import { useMemberStore } from './store'

const columns = [
  {
    title: '成员名称/ID',
    dataIndex: 'user_id',
    key: 'id',
    render: (
      text: string,
      { user_info: { user_id, user_name } }: Record<string, any>
    ) => {
      return (
        <FlexBox tw="items-center truncate space-x-2">
          <Center tw="bg-[#E2E8F0] rounded-full w-6 h-6">
            <Icon name="human" type="dark" size={16} />
          </Center>
          <div tw="flex-1 break-all truncate">
            <div tw="truncate table-instance-name">
              <TextEllipsis>{user_name}</TextEllipsis>
            </div>
            <div tw="truncate table-instance-id">
              <TextEllipsis>{user_id}</TextEllipsis>
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
    render: (_: string, { user_info: { email } }: Record<string, any>) => (
      <TextEllipsis>{email}</TextEllipsis>
    ),
  },
  {
    title: '角色',
    dataIndex: 'system_role_ids',
    key: 'role',
  },
  {
    title: '加入时间',
    dataIndex: 'created',
    key: 'created',
    render: (val: string) => {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss') // TODO: 时间格式化 是否为毫秒
    },
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
  const {
    op,
    setOp,
    setActiveKeys,
    setSelectedKeys,
    selectedKeys,
    activeKeys,
  } = useMemberStore()

  const [filter, setFilter] = useImmer({
    search: '',
    offset: 0,
    limit: 10,
    reverse: true,
  })
  const handleSelect = (keys: string[]) => {
    setSelectedKeys(keys)
  }

  const handleSort = (key: string) => {
    console.log(key)
  }

  const handleFilterChange = (key: string, value: string) => {
    console.log(key, value)
  }

  const { data, isFetching, refetch } = useQueryMemberList(filter)
  const { data: roleList } = useQueryRoleList()

  const operation = useMemo(
    () => ({
      title: '操作',
      key: 'option',
      render: (_: any, record: any) => (
        <FlexBox tw="items-center">
          <Button
            type="text"
            tw="text-green-11! font-semibold"
            onClick={() => {
              setOp('update')
              setActiveKeys([record.user_id])
            }}
          >
            修改
          </Button>
          <Button
            type="text"
            tw="text-green-11! font-semibold"
            onClick={() => {
              setOp('delete')
              setActiveKeys([record.user_id])
            }}
          >
            删除
          </Button>
        </FlexBox>
      ),
    }),
    [setActiveKeys, setOp]
  )

  const mutation = useMutationMember()

  const handleUpdate = useCallback(
    (record: Record<string, any>) => {
      mutation
        .mutateAsync({
          op: 'update',
          user_id: record.user_id,
          system_role_ids: record.system_role_ids,
          desc: record.desc,
        })
        .finally(() => {
          refetch()
        })
    },
    [mutation, refetch]
  )

  const handleRemoveRole = useCallback(
    (record: Record<string, any>, roleId: string, reset: Function) => {
      const { user_id: userId, system_roles: systemRoles } = record
      const newRoleIds = systemRoles
        .filter(({ id }: { id: string }) => id !== roleId)
        .map(({ id }: { id: string }) => id)
      if (newRoleIds.length === 0) {
        reset()
        emitter.emit('error', { title: '用户至少拥有一个角色' })
      } else {
        handleUpdate({
          user_id: userId,
          system_role_ids: newRoleIds,
          desc: record.desc,
        })
      }
    },
    [handleUpdate]
  )

  const columnsRender: Record<string, any> = useMemo(
    () => ({
      role: {
        render: (_: any, record: Record<string, any>) => {
          const { system_roles: systemRoles } = record
          return (
            <FlexBox tw="gap-1">
              {systemRoles.map((role: any) => {
                return (
                  <Tag
                    closable
                    css={[tw`text-neut-15!`]}
                    onClose={(e: { preventDefault: Function }) =>
                      handleRemoveRole(record, role.id, () =>
                        e.preventDefault()
                      )
                    }
                    key={role.id}
                    tw="text-sm"
                  >
                    {role.name}
                  </Tag>
                )
              })}
            </FlexBox>
          )
        },
      },
    }),
    [handleRemoveRole]
  )

  const columnsWithRender: Record<string, any>[] = useMemo(
    () =>
      columns.map((column: any) => {
        if (columnsRender[column.key]) {
          return {
            ...column,
            ...columnsRender[column.key],
          }
        }
        return column
      }),
    [columnsRender]
  )

  const activeRows = useMemo(
    () =>
      (data?.infos || []).filter((item: { user_id: string }) =>
        activeKeys.includes(item?.user_id)
      ),
    [activeKeys, data?.infos]
  )

  const handleCloseModal = useCallback(() => {
    setOp('')
  }, [setOp])

  const handleRemoveUser = useCallback(() => {
    mutation
      .mutateAsync({
        op: 'delete',
        userIds: activeKeys,
      })
      .then(() => {
        refetch()
        setOp('')
      })
  }, [activeKeys, mutation, refetch, setOp])

  const columnsWithOperation = useMemo(
    () => [...columnsWithRender, operation],
    [columnsWithRender, operation]
  )

  return (
    <Root>
      <PageTab tabs={memberTabs} />
      <div tw="bg-white rounded">
        <MemberTableBar
          columns={columnsWithRender as any}
          setFilter={setFilter}
        />
        <Card tw="flex-1 pb-5 px-5">
          <Table
            onSelect={handleSelect}
            selectedRowKeys={selectedKeys}
            selectType="checkbox"
            loading={isFetching}
            dataSource={data?.infos || []}
            // dataSource={dataSource}
            onSort={handleSort}
            onFilterChange={handleFilterChange}
            pagination={{
              total: data?.total || 0,
              current: filter.offset / filter.limit + 1,
              pageSize: filter.limit,
              onPageChange: (current: number) => {
                setFilter((draft) => {
                  draft.offset = (current - 1) * filter.limit
                })
              },
              onShowSizeChange: (size: number) => {
                setFilter((draft) => {
                  draft.offset = 0
                  draft.limit = size
                })
              },
            }}
            columns={columnsWithOperation}
            rowKey="user_id"
          />
        </Card>
      </div>
      {new Set(['update', 'create', 'detail']).has(op) && (
        <MemberModal roleList={roleList?.infos || []} data={activeRows[0]} />
      )}
      {op === 'delete' && (
        <MemberDeleteModal
          data={activeRows}
          columns={columnsWithRender}
          onClose={handleCloseModal}
          onOk={handleRemoveUser}
        />
      )}
    </Root>
  )
})
export default Member
