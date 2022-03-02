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
