import { Table } from '@QCFE/qingcloud-portal-ui'
import { networkColumns, networkStatusMap } from 'views/Space/Manage/Network/common/constants'
import tw, { css, styled } from 'twin.macro'
import { Tooltip, Center, InstanceName, StatusBar } from 'components'
import { useColumns } from 'hooks/useHooks/useColumns'
import { useIsFetching } from 'react-query'
import { MappingKey } from 'utils/types'
import { isDarkTheme } from 'utils/theme'
import React from 'react'
import { getQueryKeyDescribeNetworkConfig } from 'hooks'
import { useParams } from 'react-router-dom'
import { networkFieldMapping } from './common/mappings'

interface INetworkProps {
  settingKey: string
  datasource?: Record<string, any>[]
}

const TableWrapper = styled.div`
  .grid-table-header .table-thead {
    ${tw`font-semibold`}
  }
`
const nameStyle = css`
  .instance-name-icon {
    ${tw`border-white border`}
  }
  &:hover {
    .instance-name-title div {
      ${tw`text-green-11!`}
    }
    .instance-name-icon {
      ${tw`bg-[#ECFDF5] border-white border`}
      .icon svg.qicon {
        ${tw`text-green-11! fill-[#9DDFC9]!`}
      }
    }
  }
`
const Tag = styled.div`
  ${tw`inline-flex items-center h-4 text-icon-single-info px-2 bg-info-light border rounded border-info-light`}
`
const getName = (name: MappingKey<typeof networkFieldMapping>) =>
  networkFieldMapping.get(name)!.apiField

export default function NetworkList(props: INetworkProps) {
  const { settingKey, datasource } = props

  const { regionId } = useParams<{ regionId: string }>()
  const isLoading = useIsFetching(getQueryKeyDescribeNetworkConfig())
  const operation = {
    title: '',
    dataIndex: 'operation',
    key: 'operation',
    render: () => (
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
  }
  const columnsRender = {
    [getName('name')]: {
      render: (name: string, record: Record<string, any>) => (
        <InstanceName
          css={nameStyle}
          theme={isDarkTheme() ? 'dark' : 'light'}
          name={
            <div
              tw="text-[#334155] leading-5 font-semibold hover:cursor-pointer"
              onClick={() => {
                window.open(`/${regionId}/vxnets/${record?.vxnet_id}`, '_blank')
              }}
            >
              {name}
            </div>
          }
          desc={record.vxnet_id}
          icon="network"
        />
      )
    },
    [getName('status')]: {
      render: (_: never, record: Record<string, any>) => (
        <StatusBar
          type={networkStatusMap.get(record?.router?.status)?.style}
          label={networkStatusMap.get(record?.router?.status)?.label}
        />
      )
    },
    [getName('network_address')]: {
      render: (_: never, record: Record<string, any>) => record.router?.ip_network
    },
    [getName('network_address_v6')]: {
      render: (_: never, record: Record<string, any>) => record.router?.vpc_ipv6_network
    }
  }

  const { columns } = useColumns(settingKey, networkColumns, columnsRender, operation)
  return (
    <TableWrapper>
      <Table columns={columns} dataSource={datasource ?? []} loading={!!isLoading} />
    </TableWrapper>
  )
}
