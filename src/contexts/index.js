import { createContext, useContext } from 'react'

const WorkSpaceContext = createContext(null)
const useWorkSpaceContext = () => useContext(WorkSpaceContext)

export { WorkSpaceContext, useWorkSpaceContext }
