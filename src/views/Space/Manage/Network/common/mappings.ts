import { Mapping } from 'utils/types'

// eslint-disable-next-line import/prefer-default-export
export const networkFieldMapping: Mapping<
  'status' | 'name' | 'network_address_v6' | 'network_address'
> = new Map([
  ['name', { label: '私有化网络名称/ID', apiField: 'vxnet_name' }],
  // ['status', { label: '状态', apiField: 'status' }],
  ['network_address', { label: '网络地址', apiField: 'network_address' }],
  ['network_address_v6', { label: 'IPv6 网络地址', apiField: 'network_address_v6' }]
])
