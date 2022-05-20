import { useEffect } from 'react'
import emitter from 'utils/emitter'
import { SOURCE_PING_RESULT, SOURCE_PING_START } from '../constant'

type PingEvent = {
  uuid: string
  sourceId?: string
  [p: string]: any
}
export const usePingEvent = (params: {
  addEmpty: (uuid: string, item: Record<string, any>) => void
  addItem: (sourceId: string, item: Record<string, any>) => void
  updateEmpty: (uuid: string, item: Record<string, any>) => void
  updateItem?: (sourceId: string, item: Record<string, any>) => void
  removeEmpty?: (uuid: string) => void
  removeItem: (sourceId: string, item: Record<'uuid' & string, any>) => void
}) => {
  const { addEmpty, addItem, updateEmpty, removeItem } = params

  const add = (item: PingEvent) => {
    const { uuid, sourceId } = item
    const isCreate = !sourceId
    if (isCreate) {
      addEmpty(uuid, item)
    } else {
      addItem(sourceId!, item)
    }
  }
  const update = (item: PingEvent) => {
    const { uuid, sourceId } = item
    const isCreate = !sourceId
    if (isCreate) {
      updateEmpty(uuid, item)
    } else {
      removeItem(sourceId!, item)
    }
  }

  useEffect(() => {
    emitter.on(SOURCE_PING_START, add)
    emitter.on(SOURCE_PING_RESULT, update)
    return () => {
      emitter.off(SOURCE_PING_START, add)
      emitter.off(SOURCE_PING_RESULT, update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { add, update }
}

export default usePingEvent
