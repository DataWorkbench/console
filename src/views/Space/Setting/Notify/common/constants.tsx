import { Mapping1 } from 'utils/types'
import {
  getName,
  notifyFieldMapping,
} from 'views/Space/Setting/Notify/common/mappings'
import { IColumn } from 'hooks/useHooks/useColumns'
import { InstanceName } from 'components/InstanceName'
import React from 'react'
// import { PbmodelNotification } from 'types/types'

export const pageTabsData = [
  {
    title: '通知列表',
    description:
      '具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定具体文案待定',
    icon: 'q-humanAppDuotone',
  },
]

function getField<T extends string, K extends string>(
  mapping: Mapping1<T, K>
): IColumn[] {
  return Array.from(mapping.entries()).map(([, i]) => {
    return {
      title: i.label,
      dataIndex: i.apiField,
      key: i.apiField,
    }
  })
}

export const columnsRender = {
  [getName('id')]: {
    render: (text: string) => (
      <InstanceName theme="light" name={text} icon="q-humanAppDuotone" />
    ),
  },
  // [getName('email')]: {
  //   render: (_: never, record: PbmodelNotification) => '',
  //   // record.items.find((i) => i.notification_item_type === 'email')?.content,
  // },
  [getName('desc')]: {
    render: () => <div tw="text-font-placeholder">asdfasfd</div>,
  },
  [getName('created')]: {
    render: (text: string) => <div tw="text-font-placeholder">{text}</div>,
  },
}

export const notifyColumns = getField(notifyFieldMapping)
