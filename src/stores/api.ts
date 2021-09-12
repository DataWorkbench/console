import request from 'utils/request'

const region = {
  load: () => request({ action: 'api/region' }),
}

const workspace = {
  load: ({ regionId, ...params }, options) =>
    request({ action: `${regionId}/v1/workspace`, ...params }, options),
  create: ({ regionId, ...params }) =>
    request({ action: `${regionId}/v1/workspace`, ...params, method: 'POST' }),
  update: ({ regionId, spaceId, ...params }) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}`,
      ...params,
      method: 'PUT',
    }),
  delete: ({ regionId, spaceIds }) =>
    request({
      action: `${regionId}/v1/workspace/deletes`,
      space_ids: spaceIds,
      method: 'POST',
    }),
  enable: ({ regionId, spaceIds }) =>
    request({
      action: `${regionId}/v1/workspace/enables`,
      space_ids: spaceIds,
      method: 'POST',
    }),
  disable: ({ regionId, spaceIds }) =>
    request({
      action: `${regionId}/v1/workspace/disables`,
      space_ids: spaceIds,
      method: 'POST',
    }),
}

const datasource = {
  loadEngineMap: ({ regionId, spaceId }) =>
    request({ action: `${regionId}/v1/workspace/${spaceId}/source/kind` }),
  create: ({ regionId, spaceId, ...params }) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/source`,
      ...params,
      method: 'POST',
    }),
  load: ({ regionId, spaceId, ...params }) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/source`,
      ...params,
    }),
}

const workflow = {
  create: ({ regionId, spaceId, ...params }) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/workflow/stream`,
      ...params,
      method: 'POST',
    }),
  load: ({ regionId, spaceId, ...params }) =>
    request({
      action: `${regionId}/v1/workspace/${spaceId}/workflow/stream`,
      ...params,
    }),
}

const api = {
  region,
  workspace,
  datasource,
  workflow,
}

export interface API {
  region: any
  workspace: any
  datasource: any
  workflow: any
}

export default api
