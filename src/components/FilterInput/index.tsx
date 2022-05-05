import { Table } from '@QCFE/lego-ui'
import { useEffect, useRef, useState } from 'react'
import { emitter } from 'utils'
import { isEqual, pick } from 'lodash-es'

const { FilterInput: FilterInputCmp } = Table as any

export interface ISuggestionTag {
  filter: string
  filterLabel: string
  value: any
  valueLabel?: string
}

export interface ISuggestionItem {
  label: string
  key: string
}

export interface ISuggestion extends ISuggestionItem {
  options?: ISuggestionItem[]
}

export interface IFilterInput {
  filterLinkKey?: string
  searchKey: string

  [propName: string]: any
}

export const FilterInput = (props: IFilterInput) => {
  const { filterLinkKey, searchKey, onChange, ...rest } = props

  const tempRef = useRef({})

  const [tags, setTags] = useState<ISuggestionTag[]>([])

  const handleChange = (tag1: ISuggestionTag[]) => {
    let result = [...tag1]
    if (result[result.length - 1]?.filter === 'keyword') {
      const item: ISuggestionTag = {
        ...result[result.length - 1],
        filter: searchKey,
      }
      result = [
        ...tag1.filter((i) => i.filter !== searchKey && i.filter !== 'keyword'),
        item,
      ]
    }

    setTags(result)

    if (onChange) {
      onChange(result)
    }

    if (filterLinkKey) {
      const temp = rest.suggestions.reduce(
        (acc: Record<string, any>, cur: ISuggestion) => {
          return {
            ...acc,
            [cur.key]: result.find((i) => i.filter === cur.key)?.value,
          }
        },
        {}
      )
      tempRef.current = temp
      emitter.emit(`${filterLinkKey}-get`, temp)
    }
  }

  useEffect(() => {
    if (filterLinkKey) {
      emitter.on(`${filterLinkKey}-set`, (data) => {
        if (
          isEqual(pick(data, Object.keys(tempRef.current)), tempRef.current)
        ) {
          return
        }

        const newTags: ISuggestionTag[] = []

        rest.suggestions.forEach((i: ISuggestion) => {
          if (data[i.key]) {
            newTags.push({
              filter: i.key,
              filterLabel: i.label,
              value: data[i.key],
              valueLabel:
                i.options?.find((o) => o.key === data[i.key])?.label ||
                data[i.key],
            })
          }
        })
        setTags(newTags)
      })

      return () => {
        emitter.off(`${filterLinkKey}-set`)
      }
    }
    return () => {}
  }, [
    filterLinkKey,
    rest.defaultKeywordLabel,
    rest.suggestions,
    searchKey,
    tags,
  ])

  return <FilterInputCmp {...rest} onChange={handleChange} tags={tags} />
}

export default FilterInput
