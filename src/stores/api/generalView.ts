import { request } from 'utils'

interface Params {
  regionId: string
  spaceId: string
}
// export const getSyncJobConf = ({ regionId, spaceId, jobId }: IWorkFlowParams) =>
//   request({
//     region: regionId,
//     uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/conf`,
//     method: 'GET',
//   })

export const getGeneraView = ({ regionId, spaceId }: Params) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/op/observable/overview`,
    method: 'GET',
  })

export default getGeneraView
