import { useMutation, useQuery } from 'react-query'
import { createWorkFlow, IWorkFlowParams, loadWorkFlow } from 'stores/api'

export const useMutationFlow = () => {
  return useMutation(async (params: IWorkFlowParams) => {
    const ret = await createWorkFlow(params)
    return ret
  })
}

let queryKey: any = ''

export const getFlowKey = () => queryKey

export const useQueryFlow = ({ regionId, spaceId }: IWorkFlowParams) => {
  const filter = {
    regionId,
    spaceId,
    limit: 100,
    offset: 0,
  }
  queryKey = ['flow', filter]
  return useQuery(queryKey, async () => loadWorkFlow(filter), {
    // keepPreviousData: true,
  })
}

export default useMutationFlow
