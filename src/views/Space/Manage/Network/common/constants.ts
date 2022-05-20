import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'
import { networkFieldMapping } from './mappings'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => {
    return {
      title: i.label,
      dataIndex: i.apiField,
      key: i.apiField,
    }
  })
}

// eslint-disable-next-line import/prefer-default-export
export const networkColumns: IColumn[] = getField(networkFieldMapping)
