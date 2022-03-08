import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import ResourceTable from './ResourceTable'

const tabs = [
  {
    title: '资源管理',
    description:
      '用户可以通过资源管理功能，上传自定义程序包，在数据计算时引用程序包。这里的程序包可以作为 JAR 作业的程序包、可以作为作业的依赖包、可以用来扩展 Connector 的功能，也可以创建自定义函数（UDF）。',
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
