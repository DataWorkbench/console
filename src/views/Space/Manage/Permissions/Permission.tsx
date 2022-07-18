import { FlexBox } from 'components/Box'
import { Tooltip } from 'components/Tooltip'
import { Menu } from '@QCFE/lego-ui'
import { Icon, Table } from '@QCFE/qingcloud-portal-ui'
import { useState } from 'react'
import tw, { css } from 'twin.macro'
import { Center } from 'components'

const { MenuItem } = Menu as any

const tableStyles = {
  withHidden: ({ hidden }: { hidden: boolean }) => {
    return [
      tw`transition-[max-height, opacity] duration-300 ease-in-out`,
      css`
        ${hidden ? tw`opacity-0 max-h-0` : tw`opacity-100 max-h-[500px]`}
      `,
    ]
  },
  withBorder: css`
    & {
      .grid-table-header {
        ${tw`border-b border-neut-3 bg-neut-2`}
      }
      .table-row {
        ${tw`border-b border-neut-3`}
        &:nth-of-type(2n) {
          ${tw`bg-neut-1`}
        }
      }
    }

    .table-thead,
    .table-col {
      ${tw`border-r border-neut-3`}
      &:nth-of-type(1) {
        ${tw`border-l`}
      }
    }
  }
  `,
}

const typeStyle = {
  wrapper: tw`w-9 h-6 rounded-sm flex items-center justify-center`,
  read: tw`bg-[#EEF2FF] text-[#6366F1]`,
  write: tw`bg-[#D9F4F1] text-[#14B8A6]`,
}

const permissionStyle = {
  title: tw`flex justify-between items-center  bg-gradient-to-r from-neut-15 to-neut-14 h-[54px] text-white p-4 pl-6`,
}

const permissionTypes = [
  { value: 0, text: '全部' },
  { value: 1, text: '读' },
  { value: 2, text: '写' },
]

interface IPermissionProps {
  data: Record<string, any>
  roles: Record<string, any>[]
  search?: string
}

const Permission = (props: IPermissionProps) => {
  const { data: dataProp, roles, search } = props
  const [filter, setFilter] = useState<number>(0)

  const data = (dataProp?.api_lists ?? [])
    .filter(
      (item: Record<string, any>) =>
        !filter || (filter && item.perm_type === filter)
    )
    .filter(
      (i) =>
        !search ||
        (search &&
          (i.display_name.includes(search) || i.api_name.includes(search)))
    )

  const [hidden, setHidden] = useState<boolean>(false)
  const defaultColumns = [
    {
      title: '权限点',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: (
        <FlexBox tw="items-center w-full justify-center ">
          <span>权限类型</span>
          <Tooltip
            theme="light"
            trigger="click"
            offset={[-10, 5]}
            placement="bottom-start"
            content={
              <Menu
                selectedKey={String(filter ?? '')}
                onClick={(e: React.SyntheticEvent, k: string, v: number) => {
                  setFilter(v)
                }}
                c
              >
                <div />
                {permissionTypes.map((o) => {
                  return (
                    <MenuItem value={o.value} key={o.value || 'all'}>
                      <FlexBox tw="w-full items-center w-full justify-between">
                        <span>{o.text}</span>
                        {o.value === filter && (
                          <i
                            className="if if-check"
                            tw="text-green-11 text-sm"
                          />
                        )}
                      </FlexBox>
                    </MenuItem>
                  )
                })}
              </Menu>
            }
          >
            <div className="table-thead-filter">
              <Icon name="if-filter" type="dark" className="icon-dark" />
            </div>
          </Tooltip>
        </FlexBox>
      ),
      dataIndex: 'perm_type',
      key: 'perm_type',
      render: (type: number) => {
        return (
          <Center tw="w-full">
            <div
              css={[
                typeStyle.wrapper,
                type === 1 ? typeStyle.read : typeStyle.write,
              ]}
            >
              {type === 1 ? '读' : '写'}
            </div>
          </Center>
        )
      },
    },
  ]

  const renderStatus = (status: boolean) => {
    return (
      <Center tw="w-full">
        <Icon
          size={20}
          name={status ? 'if-check' : 'if-close'}
          css={[status ? tw`text-[#059669]` : tw`text-neut-15`, tw`text-lg`]}
        />
      </Center>
    )
  }

  const columns = (roles || []).reduce((acc: Record<string, any>[], cur) => {
    return [
      ...acc,
      {
        title: <Center tw="w-full">{cur.name}</Center>,
        dataIndex: `role_${cur.type}`,
        key: cur.type,
        render: renderStatus,
      },
    ]
  }, defaultColumns)
  return (
    <div css={tw`mb-5 last:mb-0`}>
      <div css={permissionStyle.title}>
        <div tw="text-sm">{dataProp.name}</div>
        <div tw="text-xs cursor-pointer" onClick={() => setHidden(!hidden)}>
          {hidden ? '展开' : '收起'}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="api_name"
        css={[tableStyles.withBorder, tableStyles.withHidden({ hidden })]}
      />
    </div>
  )
}

export default Permission
