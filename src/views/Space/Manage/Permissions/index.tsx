import { PageTab } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'
import { Loading, Table as LTable } from '@QCFE/lego-ui'
import { getHelpCenterLink } from 'utils'
import { useQueryRoleList, useQueryRolePermissionList } from 'hooks'

import { Card, Center } from 'components'
import { useState } from 'react'
import Permission from './Permission'

const { FilterInput } = LTable as any

const Root = styled.div``

const permissionTabs = [
  {
    title: '权限列表',
    description: '通过给空间成员分配不同的角色来实现权限控制管理.',
    icon: 'licenses',
    helpLink: getHelpCenterLink(
      '/manual/data_development/flink_cluster/create_cluster/'
    ),
  },
]

const getPermissionList = (infos: Record<string, any>[]) => {
  return infos.map((item) => {
    return {
      ...item,
      api_lists: (item?.api_lists || []).map((api: Record<string, any>) => {
        const { permissions, ...rest } = api
        permissions.forEach((permission: Record<string, any>) => {
          Object.assign(rest, {
            [`role_${permission.system_role.type}`]: permission.allowed,
          })
        })
        return rest
      }),
    }
  })
}

const PermissionList = () => {
  const { data: roleList, isFetching: isRoleFetching } = useQueryRoleList()

  const { data: rolePermissionList, isFetching } = useQueryRolePermissionList()

  // const [filter, setFilter] = useImmer({
  //   search: '',
  //   perm_type: undefined as unknown as number,
  // })

  const [tags, setTags] = useState<any[]>([])

  return (
    <Root>
      <PageTab tabs={permissionTabs} />
      {isRoleFetching || isFetching ? (
        <Center tw="h-80">
          <Loading />
        </Center>
      ) : (
        <>
          <div
            tw="bg-neut-1 px-5 py-3.5"
            css={css`
              .table-filter-bar {
                ${tw`w-[400px]! bg-white border border-neut-3`}
              }
            `}
          >
            {/* <InputSearch */}
            {/*   tw="w-[400px]" */}
            {/*   onPressEnter={(e) => setSearch((e.target as any).value)} */}
            {/*   onClear={() => setSearch('')} */}
            {/* /> */}
            <FilterInput
              placeholder="请输入关键词进行搜索"
              suggestions={(rolePermissionList?.infos ?? []).map((i) => ({
                label: i.name,
                key: i.id,
              }))}
              tags={tags}
              onChange={setTags}
            />
          </div>
          <Card tw="p-5">
            {getPermissionList(rolePermissionList?.infos || []).map(
              (item: Record<string, any>) => (
                <Permission
                  data={item}
                  roles={roleList?.infos || []}
                  search={tags.find((i) => i.filter === item.id)?.value}
                  key={item.id}
                />
              )
            )}
          </Card>
        </>
      )}
    </Root>
  )
}
export default PermissionList
