/* eslint-disable no-bitwise */
const storageKey = 'DATAOMNIS_STORAGE_KEY'

interface StorageData {
  value: any
  expires: number
  key: string
}

type IStorage = Record<string | number, StorageData>

const hashCode = function (str: string): number {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i += 1) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

const setStorage = (key: string, value: any, expiresTime: number) => {
  try {
    const hashKey = hashCode(key)
    const storage: IStorage = JSON.parse(
      window.localStorage.getItem(storageKey) ?? '{}'
    )
    storage[hashKey] = {
      value,
      key,
      expires: expiresTime ? Date.now() + expiresTime : 0,
    }
    window.localStorage.setItem(storageKey, JSON.stringify(storage))
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

const getStorage = (key: string) => {
  try {
    const hashKey = hashCode(key)
    const storage: IStorage = JSON.parse(
      window.localStorage.getItem(storageKey) ?? '{}'
    )
    const data = storage?.[hashKey]
    if (data && data.expires >= Date.now()) {
      return data.value
    }
    if (data && data.expires < Date.now()) {
      delete storage[hashKey]
      window.localStorage.setItem(storageKey, JSON.stringify(storage))
    }
    return undefined
  } catch (error) {
    console.error(error)
    return undefined
  }
}

const clearStorage = () => {
  try {
    const storage: IStorage = JSON.parse(
      window.localStorage.getItem(storageKey) ?? '{}'
    )
    Object.entries(storage).forEach(([key, value]) => {
      if (!value || value.expires < Date.now()) {
        delete storage[key]
      }
    })
    window.localStorage.setItem(storageKey, JSON.stringify(storage))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export { setStorage, getStorage, clearStorage }
