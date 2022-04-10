export type ValueOf<T> = T[keyof T]
const tuple = <T extends string[]>(...args: T) => args
