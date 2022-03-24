import { createContext } from 'react'

const JsplumbContext = createContext<{
  instance?: Record<string, any>
  addNode?: (uuid: string) => void
}>({ instance: undefined, addNode: undefined })

export default JsplumbContext
