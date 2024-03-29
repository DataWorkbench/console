import { Mapping1 } from 'utils/types'
import { getName, notifyFieldMapping } from 'views/Space/Setting/Notify/common/mappings'
import { IColumn } from 'hooks/useHooks/useColumns'
import { InstanceName } from 'components/InstanceName'
import React from 'react'
import { formatDate } from 'utils/convert'
// import { PbmodelNotification } from 'types/types'

export const pageTabsData = [
  {
    title: '通知列表',
    description:
      '具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定',
    icon: 'q-humanAppDuotone'
  }
]

function getField<T extends string, K extends string>(mapping: Mapping1<T, K>): IColumn[] {
  return Array.from(mapping.entries()).map(([, i]) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}

export const columnsRender = {
  [getName('id')]: {
    render: (text: string) => <InstanceName theme="light" name={text} icon="q-humanAppDuotone" />
  },
  [getName('desc')]: {
    render: (desc: string) => <div tw="text-font-placeholder">{desc}</div>
  },
  [getName('created')]: {
    render: (text: number) => <div tw="text-font-placeholder">{formatDate(text)}</div>
  }
}

export const notifyColumns = getField(notifyFieldMapping)
