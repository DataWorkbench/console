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
  loadEngineMap: () => request({ action: 'v1/enginemap/flink' }),
  create: ({ spaceId, ...params }) =>
    request({
      action: `v1/workspace/${spaceId}/sourcemanager`,
      ...params,
      method: 'POST',
    }),
  load: ({ spaceId, ...params }) =>
    request({ action: `v1/workspace/${spaceId}/sourcemanager`, ...params }),
}

const workflow = {
  create: ({ space, ...params }) =>
    request({
      action: `v1/workspace/${space}/workflow/stream`,
      ...params,
      method: 'POST',
    }),
  load: ({ space, ...params }) =>
    request({ action: `v1/workspace/${space}/workflow/stream`, ...params }),
}

const api = {
  region,
  workspace,
  datasource,
  workflow,
}

export default api
