import React, { ReactElement, useMemo, useState } from 'react'
import { FlexBox } from 'components/Box'
import { Tooltip } from 'components/Tooltip'
import { Icon, Menu } from '@QCFE/lego-ui'
import tw, { css } from 'twin.macro'

const { MenuItem } = Menu as any

export interface IColumn {
  title: string | ReactElement
  dataIndex?: string
  key?: string
  width?: number
  render?: (text: never, record: Record<string, any>) => ReactElement | string
  sortable?: boolean
  sortOrder?: string
  filterAble?: boolean
  filtersNew?: { text: string; value: string }[]
  onFilter?: (v: string) => void
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
          const item = {
            ...column,
            ...columnsRender[column.key]
          }
          if (typeof item.title === 'string' && item.filterAble && item.filtersNew?.length) {
            item.title = (
              <FlexBox tw="items-center">
                <span>{item.title}</span>
                <Tooltip
                  trigger="click"
                  placement="bottom-start"
                  content={
                    <Menu
                      selectedKey={String(item.filter || 'all')}
                      onClick={
                        item.onFilter
                          ? (e: React.SyntheticEvent, k: string, v: number) => item.onFilter(v)
                          : undefined
                      }
                    >
                      <MenuItem value="" key="all">
                        全部
                      </MenuItem>
                      {item.filtersNew.map(({ value, label }: { value: string; label: string }) => (
                        <MenuItem value={value} key={value}>
                          <FlexBox tw="justify-between flex-auto">
                            <span>{label}</span>
                            {item.filter === value && (
                              <Icon name="check" tw="ml-4" size={16} type="light" />
                            )}
                          </FlexBox>
                        </MenuItem>
                      ))}
                    </Menu>
                  }
                >
                  <Icon
                    name="filter"
                    type="light"
                    clickable
                    tw="ml-1 block"
                    css={css`
                      &.icon .qicon {
                        ${item.filter ? tw`dark:text-white!` : tw`dark:text-[#fff6]!`}
                      }
                    `}
                  />
                </Tooltip>
              </FlexBox>
            )
          }
          return item
        }
        return column
      }),
    [columnsRender, defaultColumns]
  )

  const filterColumn =
    Array.isArray(columnSettings) && columnSettings.length
      ? columnSettings
          .map(
            (o: { key: string; checked: boolean }) =>
              o.checked && columnsWithRender.find((col: any) => col.key === o.key)
          )
          .filter(Boolean)
      : columnsWithRender

  const columns: IColumn[] = useMemo(
    () => (operation ? [...filterColumn, operation] : filterColumn) as IColumn[],
    [filterColumn, operation]
  )

  return {
    columns,
    columnSettings,
    setColumnSettings
  }
}
