import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { localstorage, PageTab, Table } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import { Card, InstanceName, TextEllipsis } from 'components'
import tw, { css, styled } from 'twin.macro'
import MemberModal from 'views/Space/Manage/Member/MemberModal'
import { observer } from 'mobx-react-lite'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import { Button } from '@QCFE/lego-ui'
import { emitter } from 'utils/index'
import {
  useMutationMember,
  useQueryMemberList,
  useQueryRoleList,
  useStore,
} from 'hooks'

import RoleFilter from 'views/Space/Manage/Member/components/RoleFilter'
import { get } from 'lodash-es'
import { OwnerWrapper } from 'views/Space/Manage/Member/styled'
import { Global } from '@emotion/react'
import { useParams } from 'react-router-dom'
import { toJS } from 'mobx'
import Tags from './components/Tags'
import MemberDeleteModal from './MemberDeleteModal'
import { columnSettingsKey, memberTabs } from './constants'
import MemberTableBar from './MemberTableBar'
import { useMemberStore } from './store'

const columns = [
  {
    title: '成员名称/ID',
    dataIndex: 'user_id',
    key: 'user_id',
    render: (text: string, record: Record<string, any>) => {
      const { user_id: userId, name: userName } = record.user_info ?? {}
      return (
        <InstanceName
          theme="light"
          name={userName}
          desc={userId}
          icon="human"
        />
      )
    },
  },
  {
    title: '成员邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 170,
    render: (text: string, record: Record<string, any>) => {
      const { email } = record.user_info ?? {}
      return <TextEllipsis>{email}</TextEllipsis>
    },
  },
  {
    title: '角色',
    dataIndex: 'system_role_ids',
    key: 'system_role_ids',
  },
  {
    title: '加入时间',
    dataIndex: 'created',
    key: 'created',
    width: 150,
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

interface IRouteParams {
  regionId: string
  spaceId: string
}

const Member = observer(
  ({
    modalView = false,
    spaceId,
    regionId: regionIdFromProps,
  }: {
    modalView?: boolean
    spaceId?: string
    regionId?: string
  }) => {
    const {
      op,
      set,
      setOp,
      setActiveKeys,
      setSelectedKeys,
      selectedKeys,
      activeKeys,
    } = useMemberStore()

    const {
      workSpaceStore: { space },
    } = useStore()

    const { regionId: regionIdFromParams } = useParams<IRouteParams>()

    const regionId = regionIdFromProps ?? regionIdFromParams

    const isOwner =
      !!space?.owner && get(window, 'USER.user_id') === space?.owner

    const [filter, setFilter] = useImmer({
      search: '',
      offset: 0,
      limit: 10,
      reverse: true,
      sort_by: '',
      filter: undefined as unknown as string[],
      regionId,
      spaceId,
    })
    const handleSelect = (keys: string[]) => {
      setSelectedKeys(keys)
    }

    const handleSort = (sortKey: string, order: 'desc' | 'asc') => {
      setFilter((_filter) => {
        _filter.sort_by = sortKey
        _filter.reverse = order === 'desc'
      })
    }

    const { data, isFetching, refetch } = useQueryMemberList(filter)
    const { data: roleList } = useQueryRoleList({ spaceId, regionId })

    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )

    const operation = useMemo(
      () => ({
        title: '操作',
        key: 'option',
        render: (_: any, record: any) => (
          <FlexBox tw="items-center">
            <Button
              type="text"
              tw="text-green-11! font-semibold"
              disabled={!isOwner}
              onClick={() => {
                set({
                  op: 'update',
                  spaceItem: { ...toJS(space), regionId },
                })
                setActiveKeys([record.user_id])
              }}
            >
              修改
            </Button>
            <Button
              type="text"
              disabled={!isOwner}
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
      [isOwner, set, space, regionId, setActiveKeys, setOp]
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
    const handleAddRole = useCallback(
      (record: Record<string, any>, roleId: string) => {
        const { user_id: userId, system_roles: systemRoles } = record
        const newRoleIds = [
          ...systemRoles.map(({ id }: { id: string }) => id),
          roleId,
        ]
        handleUpdate({
          user_id: userId,
          system_role_ids: newRoleIds,
          desc: record.desc,
        })
      },
      [handleUpdate]
    )

    const columnsRender: Record<string, any> = useMemo(
      () => ({
        system_role_ids: {
          title: (
            <RoleFilter
              value={filter.filter}
              options={(roleList?.infos || []).map(
                (i: Record<string, any>) => ({
                  label: i.name,
                  value: i.id,
                })
              )}
              onChange={(roleIds) =>
                setFilter((draft) => {
                  draft.filter = roleIds
                })
              }
            />
          ),
          render: (_: any, record: Record<string, any>) => {
            return (
              <div tw="overflow-auto">
                <Tags
                  data={record}
                  list={roleList?.infos || []}
                  handleAdd={handleAddRole}
                  handleRemove={handleRemoveRole}
                />
              </div>
            )
          },
        },
        created: {
          sortable: true,
          sortOrder:
            // filter.reverse ? 'asc' : 'desc',
            // eslint-disable-next-line no-nested-ternary
            filter.sort_by === 'created'
              ? !filter.reverse
                ? 'asc'
                : 'desc'
              : '',
          render: (v: number) => (
            <span tw="dark:text-neut-8">
              {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          ),
        },
      }),
      [
        filter.filter,
        filter.reverse,
        filter.sort_by,
        handleAddRole,
        handleRemoveRole,
        roleList?.infos,
        setFilter,
      ]
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
          (activeKeys || []).includes(item?.user_id)
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

    const filterColumn = columnSettings.length
      ? columnSettings
          .map((o: { key: string; checked: boolean }) => {
            return (
              o.checked &&
              columnsWithRender.find((col: any) => col.key === o.key)
            )
          })
          .filter(Boolean)
      : columnsWithRender

    const columnsWithOperation = useMemo(
      () => [...filterColumn, operation],
      [filterColumn, operation]
    )

    return (
      <Root>
        <Global styles={OwnerWrapper.isOwner({ isOwner })} />

        {!modalView && <PageTab tabs={memberTabs} />}
        <div tw="bg-white rounded">
          <MemberTableBar
            modalView={modalView}
            columns={columnsWithRender as any}
            setFilter={setFilter}
            filter={filter}
            setColumnSettings={setColumnSettings}
            isOwner={isOwner}
            spaceItem={{
              ...space,
              regionId,
            }}
          />
          <Card css={[tw`flex-1 p-5 pt-2`]}>
            <Table
              css={OwnerWrapper.isOwner({ isOwner })}
              onSelect={handleSelect}
              selectedRowKeys={selectedKeys}
              selectType="checkbox"
              loading={isFetching}
              dataSource={data?.infos || []}
              // dataSource={dataSource}
              onSort={handleSort}
              // onFilterChange={handleFilterChange}
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
        {op === 'delete' &&
          createPortal(
            <MemberDeleteModal
              data={activeRows}
              columns={columnsWithRender}
              onClose={handleCloseModal}
              onOk={handleRemoveUser}
            />,
            document.body
          )}
      </Root>
    )
  }
)
export default Member
