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
) => request({ action: `${regionId}/v1/workspace`, ...rest }, options)

export const createWorkSpace = ({ regionId, ...rest }: IWorkSpaceParams) =>
  request({ action: `${regionId}/v1/workspace`, ...rest, method: 'POST' })

export const updateWorkSpace = ({
  regionId,
  spaceId,
  ...rest
}: IWorkSpaceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}`,
    ...rest,
    method: 'PUT',
  })

export const deleteWorkSpaces = ({ regionId, spaceIds }: IWorkSpaceParams) =>
  request({
    action: `${regionId}/v1/workspace/deletes`,
    space_ids: spaceIds,
    method: 'POST',
  })

export const enableWorkSpaces = ({ regionId, spaceIds }: IWorkSpaceParams) =>
  request({
    action: `${regionId}/v1/workspace/enables`,
    space_ids: spaceIds,
    method: 'POST',
  })

export const disableWorkSpaces = ({ regionId, spaceIds }: IWorkSpaceParams) =>
  request({
    action: `${regionId}/v1/workspace/disables`,
    space_ids: spaceIds,
    method: 'POST',
  })
