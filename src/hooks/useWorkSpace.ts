import { useInfiniteQuery, useQuery, useMutation } from 'react-query'
import { omit } from 'lodash-es'
import {
  loadWorkSpace,
  IListWorkSpaceParams,
  disableWorkSpaces,
  enableWorkSpaces,
  deleteWorkSpaces,
  createWorkSpace,
  updateWorkSpace,
} from 'stores/api'

const keys: {
  infinite: any
  page: any
} = {
  infinite: '',
  page: '',
}

export const getWorkSpaceKey = (kind: 'infinite' | 'page') => keys[kind]

export const useQueryWorkSpace = (filter: IListWorkSpaceParams) => {
  const queryKey = ['workspaces', omit(filter, 'offset')]
  keys.infinite = queryKey
  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = filter }) => {
      // console.log(pageParam)
      const ret = await loadWorkSpace(pageParam)
      if (!ret || ret.ret_code !== 0) {
        throw new Error('no data')
      }
      return ret
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.has_more) {
          const nextOffset = allPages.reduce(
            (acc, cur) => acc + cur.infos.length,
            0
          )
          if (nextOffset < lastPage.total) {
            const nextFilter = {
              ...filter,
              offset: nextOffset,
            }

            return nextFilter
          }
        }
        return undefined
      },
    }
  )
}

export const useQueryPageWorkSpace = (filter: IListWorkSpaceParams) => {
  const queryKey = ['workspaces', filter]
  keys.page = queryKey
  // console.log(filter)
  return useQuery(
    queryKey,
    async () => {
      const ret = await loadWorkSpace(filter)
      if (!ret || ret.ret_code !== 0) {
        throw new Error('error')
      }
      return ret
    },
    {
      keepPreviousData: true,
    }
  )
}
// {IWorkSpaceParams, 'disable' | 'enable' | 'delete' | 'create'}
interface MutationWorkSpaceParams {
  regionId: string
  op: 'disable' | 'enable' | 'delete' | 'create' | 'update'
  spaceIds?: string[]
  space?: {
    id: string
    [k: string]: string
  }
}

export const useMutationWorkSpace = (options?: {}) => {
  return useMutation(async ({ op, ...rest }: MutationWorkSpaceParams) => {
    if (['disable', 'enable', 'delete', 'create', 'update'].includes(op)) {
      let ret
      if (op === 'create') {
        ret = await createWorkSpace(rest)
      } else if (op === 'update') {
        ret = await updateWorkSpace(rest)
      } else if (op === 'disable') {
        ret = await disableWorkSpaces(rest)
      } else if (op === 'enable') {
        ret = await enableWorkSpaces(rest)
      } else if (op === 'delete') {
        ret = await deleteWorkSpaces(rest)
      }
      if (!ret || ret.ret_code !== 0) {
        throw new Error('no data')
      }
      return ret
    }
    return undefined
  }, options)
}

export default useQueryWorkSpace
