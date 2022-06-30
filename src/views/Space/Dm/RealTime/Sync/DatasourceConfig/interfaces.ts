import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'

export interface IJob {
  id: string
  name: string
  /**
   * 1 => "OfflineFull" 2 => "OfflineIncrement" 3 => "RealTime"
   *  */
  type: 1 | 2 | 3
  desc: string
  version: string
  source_type?: SourceType
  target_type?: SourceType
  jobMode?: 'DI' | 'RT' | 'OLE'
}

export interface IDataSourceConfigProps {
  curJob?: IJob
}
export interface ISourceRef {
  validate: () => boolean
  getData: () => Record<string, any> | undefined
  refetchColumn?: () => void
}
