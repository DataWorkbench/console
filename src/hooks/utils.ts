import { ReactElement, useMemo, useState } from 'react'

export interface IColumn {
  title: string | ReactElement
  dataIndex?: string
  key?: string
  width?: number
  render?: (text: never, record: Record<string, any>) => ReactElement | string
  sortable?: true
  sortOrder?: string

  [propName: string]: any
}

export const useColumns = (
  settingsKey: string,
  defaultColumns: IColumn[],
  columnsRender: Record<string, Partial<IColumn>>,
  operation?: Partial<IColumn>
) => {
  const [columnSettings, setColumnSettings] = useState(() => {
    const settings = localStorage.getItem(settingsKey)
    if (settings) {
      return JSON.parse(settings)?.value
    }
    return undefined
  })
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

  console.log('columnsWithRender', columnsWithRender, columnSettings)
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

  const columns: IColumn[] = useMemo(
    () =>
      (operation ? [...filterColumn, operation] : filterColumn) as IColumn[],
    [filterColumn, operation]
  )

  return {
    columns,
    columnSettings,
    setColumnSettings,
  }
}
