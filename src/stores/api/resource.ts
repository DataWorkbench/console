import { request, customRequest } from 'utils'

export interface IResourceParams {
  regionId?: string
  spaceId?: string
  [k: string]: unknown
}

interface IResource {
  regionId: string
  spaceId: string
}

export const loadResourceList = (
  { regionId, spaceId, ...rest }: IResourceParams,
  { cancel }: { cancel?: (_: any) => void } = {}
) =>
  request(
    {
      region: regionId,
      uri: `/v1/workspace/${spaceId}/file`,
      query: rest,
    },
    { cancel: cancel as any }
  )

export interface IListResourceParams extends IResource {
  limit?: number
  offset?: number
  name?: string
  type?: string
  reverse?: boolean
  search?: string
  sort_by?: object
}

export const loadSignature = (
  { region, uri, headers, method }: any,
  { cancel }: { cancel?: (_: any) => void } = {}
) =>
  request(
    {
      action: 'GenerateSign',
      method,
      headers,
      region,
      uri,
    },
    { cancel: cancel as any }
  )

export const createResourceJob = ({
  endpoint,
  spaceId,
  headers,
  cancel,
  ...rest
}: any) => {
  const params = new FormData()
  Object.keys(rest).map((key: any) => params.append(key, rest[key]))
  return customRequest(
    {
      url: `${endpoint}/v1/workspace/${spaceId}/file`,
      headers,
      params,
    },
    { cancel }
  )
}

export const reuploadResource = ({
  endpoint,
  spaceId,
  headers,
  cancel,
  id,
  ...rest
}: any) => {
  const params = new FormData()
  params.append('file', rest.file)
  return customRequest(
    {
      url: `${endpoint}/v1/workspace/${spaceId}/file/${id}`,
      headers,
      params,
    },
    { cancel }
  )
}

export const deleteResource = ({
  regionId,
  spaceId,
  resourceIds,
}: IResourceParams) =>
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/file/deletes`,
    body: {
      file_ids: resourceIds,
    },
  })

export const updateResource = ({ regionId, spaceId, id, ...rest }: any) =>
  request({
    region: regionId,
    method: 'PUT',
    uri: `/v1/workspace/${spaceId}/file/${id}`,
    body: { ...rest },
  })

export const downloadFile = ({ endpoint, spaceId, headers, id }: any) =>
  customRequest(
    {
      url: `${endpoint}/v1/workspace/${spaceId}/file/${id}/download`,
      method: 'GET',
      headers,
    },
    { responseType: 'blob' }
  )
