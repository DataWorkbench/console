import { Mapping } from 'utils/types'

// eslint-disable-next-line import/prefer-default-export
export const ClusterFieldMapping: Mapping<
  'status' | 'name' | 'cu' | 'mode' | 'term_validity' | 'last_updated'
> = new Map([
  ['name', { label: '名称/ID', apiField: 'vxnet_name' }],
  ['status', { label: '状态', apiField: 'status' }],
  ['cu', { label: 'CU 规格', apiField: 'network_address' }],
  ['mode', { label: '计费模式', apiField: 'network_address_v6' }],
  ['term_validity', { label: '购买有效期', apiField: 'network_address_v6' }],
  ['last_updated', { label: '最近更新时间', apiField: 'network_address_v6' }]
])
