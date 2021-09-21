import { createContext, useContext } from 'react'

export interface IWorkSpaceState {
  (): {
    set(o: Record<string, unknown>): void
    [propName: string]: any
  }
}

const WorkSpaceContext = createContext({} as any)
const useWorkSpaceContext = () => useContext(WorkSpaceContext)

export { WorkSpaceContext, useWorkSpaceContext }
