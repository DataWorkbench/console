import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import ResourceTable from './ResourceTable'

const tabs = [
  {
    title: '资源管理',
    description:
      '用户可以通过资源管理功能，上传自定义代码或文本文件作为资源，在节点运行时调用。可调用资源的节点包含 DLI Spark、MRS Spark、MRS MapReduce和 DLI Flink Job。创建资源后，配置资源关联的文件。在作业中可以直接引用资源。当资源文件变更，只需要修改资源引用的位置即可，不需要修改作业配置。',
    icon: 'resource',
    helpLink: getHelpCenterLink('/manual/data_development/resource/summary/'),
  },
]

const Resource = () => {
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={tabs} />
      <ResourceTable tw="flex-1" />
    </FlexBox>
  )
}

export default Resource
