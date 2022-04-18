import { useLocalStorage } from 'react-use'
import { ReactElement, useMemo } from 'react'

export interface IColumn {
  title: string | ReactElement
  dataIndex: string
  key?: string
  width?: number
  render?: (text: any, record: any) => ReactElement | string
  sortable?: true
  sortOrder: string
  [propName: string]: any
}

export const useColumns = (
  settingsKey: string,
  defaultColumns: IColumn[],
  columnsRender: Record<string, Partial<IColumn>>,
  operation?: Partial<IColumn>
) => {
  const [columnSettings, setColumnSettings] = useLocalStorage(
    settingsKey,
    false
  )

  const columnsWithRender: Record<string, any>[] = useMemo(
    () =>
      defaultColumns.map((column: any) => {
        if (columnsRender[column.key]) {
          return {
            ...column,
            ...columnsRender[column.key],
          }
        }
        return column
      }),
    [columnsRender, defaultColumns]
  )

  const filterColumn =
    Array.isArray(columnSettings) && columnSettings.length
      ? columnSettings
          .map((o: { key: string; checked: boolean }) => {
            return (
              o.checked &&
              columnsWithRender.find((col: any) => col.key === o.key)
            )
          })
          .filter(Boolean)
      : columnsWithRender

  const columns = useMemo(
    () => (operation ? [...filterColumn, operation] : filterColumn),
    [filterColumn, operation]
  )

  return {
    columns,
    columnSettings,
    setColumnSettings,
  }
}
