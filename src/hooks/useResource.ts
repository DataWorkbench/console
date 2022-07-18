import { omit } from 'lodash-es'
import { useQuery, useInfiniteQuery, useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  loadResourceList,
  createResourceJob,
  loadSignature,
  deleteResource,
  updateResource,
  downloadFile,
  reuploadResource
} from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

const keys: {
  infinite: any
  page: any
  detail: any
} = {
  infinite: '',
  page: '',
  detail: ''
}

export const getResourceKey = (kind: 'infinite' | 'page' | 'detail' = 'page') => keys[kind]

export const useQueryResource = (filter: Record<string, any>, options = {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  const rest = omit(filter, 'offset')

  const params = {
    regionId,
    spaceId,
    limit: 10,
    ...rest
  }

  const queryKey = ['resource', params]
  keys.infinite = queryKey

  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = filter }) => loadResourceList({ ...pageParam, regionId, spaceId }),
    {
      getNextPageParam: (lastPage: any, allPages: any) => {
        if (lastPage.has_more) {
          const nextOffset = allPages.reduce(
            (acc: number, cur: Record<string, any>) => acc + cur.infos.length,
            0
          )
          if (nextOffset < lastPage.total) {
            const nextFilter = {
              ...filter,
              offset: nextOffset
            }
            return nextFilter
          }
        }
        return undefined
      },
      ...options
    }
  )
}

let resourcePageKey: any = ''

export const getResourcePageQueryKey = () => resourcePageKey

export const useQueryResourceByPage = (filter: any) => {
  const types = filter.type ? [filter.type] : undefined
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    types,
    ...filter
  }
  resourcePageKey = ['resourcePageList', params]
  return useQuery(resourcePageKey, async () => loadResourceList(params), {
    keepPreviousData: true
  })
}

export const useMutationResource = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async ({
      op,
      cancel,
      ...rest
    }: {
      op: OP
      cancel?: any
      resourceIds?: String[]
      id?: String
    }) => {
      const formParams: any = { spaceId, ...rest }
      const params: any = {
        ...rest,
        regionId,
        spaceId
      }
      let ret = null
      let endpoint = ''
      let headers = ''
      if (op === 'create') {
        ret = await loadResourceList(
          {
            regionId,
            spaceId,
            name: formParams.name,
            type: formParams.type
          },
          { cancel }
        )
        if (ret?.infos?.length > 0) return 'DUPLICATE_RESOURCE_NAME'
      }

      if (['create', 'enable', 'view'].includes(op)) {
        const uri =
          // eslint-disable-next-line no-nested-ternary
          op === 'create'
            ? `/v1/workspace/${spaceId}/file`
            : op === 'view'
            ? `/v1/workspace/${spaceId}/file/${formParams.id}`
            : `/v1/workspace/${spaceId}/file/${formParams.id}/download`
        const signature = await loadSignature(
          {
            region: regionId,
            uri,
            method: op === 'enable' ? 'GET' : 'POST',
            headers: {
              'Content-Type': op === 'enable' ? '' : 'multipart/form-data'
            }
          },
          { cancel }
        )
        endpoint = signature.endpoint
        headers = signature.headers
      }
      if (op === 'create') {
        ret = await createResourceJob({
          cancel,
          endpoint,
          headers,
          ...formParams
        })
      } else if (op === 'edit') {
        params.type = undefined
        ret = await updateResource(params)
      } else if (op === 'delete') {
        ret = await deleteResource(params)
      } else if (op === 'enable') {
        ret = await downloadFile({ endpoint, headers, ...formParams })
      } else if (op === 'view') {
        ret = await reuploadResource({
          cancel,
          endpoint,
          headers,
          ...formParams
        })
      }
      return ret
    }
  )
}

export default useMutationResource
