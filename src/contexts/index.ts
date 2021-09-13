import { createContext, useContext } from 'react'

interface WorkSpaceState {
  (): {
    set(o: Record<string, unknown>): void
    [propName: string]: any
  }
}

const WorkSpaceContext = createContext(null)
const useWorkSpaceContext: WorkSpaceState = () => useContext(WorkSpaceContext)

export { WorkSpaceContext, useWorkSpaceContext }
