import request from 'utils/request'

const region = {
  load: () => request({ action: 'api/region' }),
}

const workspace = {
  load: ({ regionId, ...filter }) =>
    request({ action: `${regionId}/v1/workspace`, ...filter }),
  create: ({ regionId, ...params }) =>
    request({ action: `${regionId}/v1/workspace`, ...params }, 'POST'),
  update: ({ regionId, spaceId, ...params }) =>
    request(
      { action: `${regionId}/v1/workspace/${spaceId}`, ...params },
      'PUT'
    ),
  delete: ({ regionId, spaceIds }) =>
    request(
      { action: `${regionId}/v1/workspace/deletes`, space_ids: spaceIds },
      'POST'
    ),
  enable: ({ regionId, spaceIds }) =>
    request(
      { action: `${regionId}/v1/workspace/enables`, space_ids: spaceIds },
      'POST'
    ),
  disable: ({ regionId, spaceIds }) =>
    request(
      { action: `${regionId}/v1/workspace/disables`, space_ids: spaceIds },
      'POST'
    ),
}

const datasource = {
  loadEngineMap: () => request({ action: 'v1/enginemap/flink' }),
  create: ({ space, ...params }) =>
    request(
      { action: `v1/workspace/${space}/sourcemanager`, ...params },
      'POST'
    ),
  load: ({ space, ...params }) =>
    request(
      { action: `v1/workspace/${space}/sourcemanager`, ...params },
      'GET'
    ),
}

const workflow = {
  create: ({ space, ...params }) =>
    request(
      { action: `v1/workspace/${space}/workflow/stream`, ...params },
      'POST'
    ),
  load: ({ space, ...params }) =>
    request(
      { action: `v1/workspace/${space}/workflow/stream`, ...params },
      'GET'
    ),
}

const api = {
  region,
  workspace,
  datasource,
  workflow,
}

export default api
