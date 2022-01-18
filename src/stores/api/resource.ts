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
      uri: `/v1/workspace/${spaceId}/resource`,
      query: rest,
    },
    { cancel: cancel as any }
  )

export interface IListResourceParams extends IResource {
  limit?: number
  offset?: number
  resource_name?: string
  resource_type?: string
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
      url: `${endpoint}/v1/workspace/${spaceId}/resource`,
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
  resource_id,
  ...rest
}: any) => {
  const params = new FormData()
  params.append('file', rest.file)
  return customRequest(
    {
      url: `${endpoint}/v1/workspace/${spaceId}/resource/${resource_id}`,
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
    uri: `/v1/workspace/${spaceId}/resource/deletes`,
    body: {
      resource_ids: resourceIds,
    },
  })

export const updateResource = ({
  regionId,
  spaceId,
  resource_id,
  ...rest
}: any) =>
  request({
    region: regionId,
    method: 'PUT',
    uri: `/v1/workspace/${spaceId}/resource/${resource_id}`,
    body: { ...rest },
  })

export const downloadFile = ({
  endpoint,
  spaceId,
  headers,
  resource_id,
}: any) =>
  customRequest(
    {
      url: `${endpoint}/v1/workspace/${spaceId}/resource/${resource_id}/download`,
      method: 'GET',
      headers,
    },
    { responseType: 'blob' }
  )
