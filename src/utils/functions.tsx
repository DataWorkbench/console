import { Component, forwardRef } from 'react'

export const connect =
  <U extends Record<string, any>, T extends Record<string, any>>(
    mapProps: (p: T) => T & U
  ) =>
  (WrapperComponent: typeof Component) =>
    forwardRef((props: T, ref: any) => (
      <WrapperComponent {...mapProps(props)} ref={ref} />
    ))

export const compose = (...fn: ((v: any) => any)[]) =>
  fn.reduce(
    (a, b) =>
      (...args: any) =>
        // @ts-ignore
        a(b(...args))
  )

export const tuple = <T extends string[]>(...args: T) => args

export const filter =
  <T extends any>(predicate: (v: T) => boolean) =>
  (next: (v: T) => void) =>
  (v: T) =>
    predicate(v) ? next(v) : undefined

export const map =
  <T extends any, U extends any>(mapper: (v: T) => U) =>
  (next: (v: U) => void) =>
  (v: T) =>
    next(mapper(v))

export const pipe = (...fns: ((v: any) => any)[]) =>
  fns.reduce(
    (a, b) =>
      (...args: any) =>
        // @ts-ignore
        a(b(...args))
  )

export const foreach =
  <T extends any>(each: (v: T) => any) =>
  (next: (v: T) => void) =>
  (v: T) => {
    each(v)
    next(v)
  }

export const collect =
  <T extends any, U extends any>(
    ...mapper: ((v: (d: U) => any) => (d: T) => any)[]
  ): ((v: U[]) => T[]) =>
  (v: U[]): T[] => {
    if (!mapper.length) {
      return v as T[]
    }
    const result: T[] = []
    v.forEach(pipe(...mapper)((i: T) => result.push(i)))
    return result
  }
