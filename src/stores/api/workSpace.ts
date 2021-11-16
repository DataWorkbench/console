import { request } from 'utils'

export interface IWorkSpaceParams {
  regionId: string
  [k: string]: any
}

interface IWorkSpace {
  regionId: string
}

export interface IListWorkSpaceParams extends IWorkSpace {
  limit?: number
  name?: string
  offset?: number
  reverse?: boolean
  search?: string
  sort_by?: string
  status?: number
}

export const loadWorkSpace = (
  { regionId, ...rest }: IListWorkSpaceParams,
  options = {}
) =>
  request(
    {
      region: regionId,
      uri: '/v1/workspace',
      query: rest,
    },
    options
  )

export const createWorkSpace = ({ regionId, ...rest }: IWorkSpaceParams) =>
  request({
    region: regionId,
    uri: '/v1/workspace',
    method: 'POST',
    body: rest,
  })

export const updateWorkSpace = ({
  regionId,
  spaceId,
  ...rest
}: IWorkSpaceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}`,
    method: 'PUT',
    body: rest,
  })

export const deleteWorkSpaces = ({ regionId, spaceIds }: IWorkSpaceParams) =>
  request({
    region: regionId,
    uri: '/v1/workspace/deletes',
    method: 'POST',
    body: { space_ids: spaceIds },
  })

export const enableWorkSpaces = ({ regionId, spaceIds }: IWorkSpaceParams) =>
  request({
    region: regionId,
    uri: '/v1/workspace/enables',
    body: { space_ids: spaceIds },
    method: 'POST',
  })

export const disableWorkSpaces = ({ regionId, spaceIds }: IWorkSpaceParams) =>
  request({
    region: regionId,
    uri: '/v1/workspace/disables',
    body: { space_ids: spaceIds },
    method: 'POST',
  })
