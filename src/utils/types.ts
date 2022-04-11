export type ValueOf<T> = T[keyof T]
export const tuple = <T extends string[]>(...args: T) => args
