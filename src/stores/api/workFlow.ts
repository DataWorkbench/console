import { request } from 'utils'

export interface IWorkFlowParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const createWorkFlow = ({
  regionId,
  spaceId,
  ...rest
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/workflow`,
    ...rest,
    method: 'POST',
  })

export const loadWorkFlow = ({ regionId, spaceId, ...rest }: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/workflow`,
    ...rest,
  })
