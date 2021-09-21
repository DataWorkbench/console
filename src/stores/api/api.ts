import { request } from 'utils'

export const region = {
  load: () => request({ action: 'api/region' }),
}

export interface WithRegionParams {
  regionId: string
  [k: string]: unknown
}

export const workspace = {
  load: ({ regionId, ...rest }: WithRegionParams, options: {}) => {
    return request({ action: `${regionId}/v1/workspace`, ...rest }, options)
  },
  create: ({ regionId, ...rest }: WithRegionParams) =>
    request({ action: `${regionId}/v1/workspace`, ...rest, method: 'POST' }),
  update: ({ regionId, spaceId, ...rest }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}`,
      ...rest,
      method: 'PUT',
    }),
  delete: ({ regionId, spaceIds }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/deletes`,
      space_ids: spaceIds,
      method: 'POST',
    }),
  enable: ({ regionId, spaceIds }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/enables`,
      space_ids: spaceIds,
      method: 'POST',
    }),
  disable: ({ regionId, spaceIds }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/disables`,
      space_ids: spaceIds,
      method: 'POST',
    }),
}

export const datasource = {
  loadEngineMap: ({ regionId, spaceId }: WithRegionParams) =>
    request({ action: `${regionId}/v1/workspace/${spaceId}/source/kind` }),
  create: ({ regionId, spaceId, ...params }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/source`,
      ...params,
      method: 'POST',
    }),
  load: ({ regionId, spaceId, ...rest }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/source`,
      ...rest,
    }),
}

export const workflow = {
  create: ({ regionId, spaceId, ...rest }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/workflow/stream`,
      ...rest,
      method: 'POST',
    }),
  load: ({ regionId, spaceId, ...rest }: WithRegionParams) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/workflow/stream`,
      ...rest,
    }),
}
