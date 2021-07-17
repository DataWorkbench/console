import request from 'utils/request'

const workspace = {
  load: (filter) => request({ action: 'v1/workspace', ...filter }),
  create: (params) => request({ action: 'v1/workspace', ...params }, 'POST'),
  delete: (id) => request({ action: `v1/workspace/${id}` }, 'DELETE'),
  update: ({ id, ...params }) =>
    request({ action: `v1/workspace/${id}`, ...params }, 'PUT'),
}

const api = {
  workspace,
}

export default api
