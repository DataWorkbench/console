import { getNetworkKey, useQueryNetworks } from 'hooks'
import React, { createContext, PropsWithChildren, useMemo } from 'react'
import { useQueryClient } from 'react-query'

export const NetworkContext = createContext<{
  networks: {
    id: string
    name: string
    [p: string]: any
  }[]
  refreshNetworks: () => void
  networkMap: Map<string, Record<string, any>>
  isFetching: boolean
}>({
  networks: [],
  refreshNetworks: () => {},
  networkMap: new Map(),
  isFetching: true,
})

export const NetworkProvider = ({ children }: PropsWithChildren<unknown>) => {
  const queryClient = useQueryClient()

  const { data: networkResp, isFetching } = useQueryNetworks({
    limit: 100, // TODO: 这里暂时写死 100
  })
  const networkMap: Map<string, Record<string, any>> = useMemo(() => {
    if (!isFetching && networkResp && networkResp?.ret_code === 0) {
      return new Map(
        (networkResp?.infos || []).map((info: Record<string, any>) => [
          info.id,
          info,
        ])
      )
    }
    return new Map()
  }, [isFetching, networkResp])

  const networks = useMemo(() => {
    if (!isFetching && networkResp && networkResp?.ret_code === 0) {
      return networkResp.infos || []
    }
    return []
  }, [isFetching, networkResp])

  const refresh = () => {
    queryClient.invalidateQueries(getNetworkKey())
  }

  return (
    <NetworkContext.Provider
      value={{
        networks,
        refreshNetworks: refresh,
        networkMap,
        isFetching,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
