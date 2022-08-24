export type ValueOf<T> = T[keyof T]
export const tuple = <T extends string[]>(...args: T) => args

export interface ITab {
  title: string
  description: string
  icon: string
  helpLink: string
}

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

export interface IPagination {
  offset: number
  limit: number
}

export interface ISort {
  sort_by?: string
  reverse?: boolean
}

export type WithPagination<T> = T & IPagination

export type WithSort<T> = T & ISort

type HasSort<T, R> = R extends true ? WithSort<T> : T
type HasPage<T, R> = R extends true ? WithPagination<T> : T

export type WithConfig<T, R> = R extends {
  pagination?: infer A
  sort?: infer B
}
  ? HasPage<HasSort<T, B>, A>
  : T

export type Mapping<T> = Map<T, { label: string; apiField: string }>

export type Mapping1<T, K> = Map<T, { label: string; apiField: string | K }>

export type MappingKey<T> = T extends Mapping<infer U> ? U : never
