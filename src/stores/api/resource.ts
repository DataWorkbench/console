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

export const loadResourceList = ({
  regionId,
  spaceId,
  ...rest
}: IResourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/resource`,
    query: rest,
  })

export interface IListResourceParams extends IResource {
  limit?: number
  offset?: number
  resource_name?: string
  resource_type?: string
  reverse?: boolean
  search?: string
  sort_by?: object
}

export const loadSignature = ({ region, spaceId }: any) =>
  request({
    region,
    method: 'POST',
    action: 'GenerateSign',
    uri: `/v1/workspace/${spaceId}/resource`,
    headers: {
      'Content-Type': 'Multipart/Form-data',
    },
  })

export const createResourceJob = ({
  endpoint,
  spaceId,
  headers,
  ...rest
}: any) => {
  const params = new FormData()
  Object.keys(rest).map((key: any) => params.append(key, rest[key]))
  return customRequest({
    url: `${endpoint}/v1/workspace/${spaceId}/resource`,
    headers,
    params,
  })
}

export const reuploadResource = ({
  endpoint,
  spaceId,
  headers,
  resource_id,
  ...rest
}: any) => {
  const params = new FormData()
  Object.keys(rest).map((key: any) => params.append(key, rest[key]))
  return customRequest({
    url: `${endpoint}/v1/workspace/${spaceId}/resource/${resource_id}`,
  })
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
  customRequest({
    url: `${endpoint}/v1/workspace/${spaceId}/resource/${resource_id}/download`,
    method: 'GET',
    headers,
  })
