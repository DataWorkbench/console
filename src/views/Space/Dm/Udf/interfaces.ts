export interface IUdfFilterInterface {
  offset: number
  limit: number
  reverse: boolean
  search?: string
  sort_by?: string
  type: 1 | 2 | 3 // UDF Type one of 1/2/3 1=>UDF/2=>UDTF/3=>UDTTF, default is 1
  language?: number
  [k: string]: any
}

export type UdfActionType = 'edit' | 'detail' | 'create' | 'delete'

export type UdfTypes = 'UDF' | 'UDTF' | 'UDTTF'

export interface ILanguageInterface {
  bit: number
  text: string
  icon: string
  type: number
}

export interface IUdfTable {
  tp: UdfTypes
}
