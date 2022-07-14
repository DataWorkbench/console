import { Mapping1, MappingKey } from 'utils/types'
import { PbmodelNotification } from 'types/types'

// eslint-disable-next-line import/prefer-default-export
export const notifyFieldMapping = (
  new Map() as Mapping1<
    'id' | 'email' | 'desc' | 'created',
    keyof PbmodelNotification
  >
)
  .set('id', { label: '消息接收人姓名/ID', apiField: 'owner' })
  .set('email', { label: '邮箱', apiField: 'owner1' })
  .set('desc', { label: '备注', apiField: 'owner2' })
  .set('created', { label: '创建时间', apiField: 'create_time' })

export const getName = (name: MappingKey<typeof notifyFieldMapping>) =>
  notifyFieldMapping.get(name)!.apiField
