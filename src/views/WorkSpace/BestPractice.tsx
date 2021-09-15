import { Card, CardHeader, CardContent, IconCard } from 'components'

const BestPractice = () => (
  <div tw="flex mt-4">
    <Card tw="flex-1 mr-4">
      <CardHeader title="最佳实践" />
      <CardContent tw="flex justify-center space-x-2 2xl:space-x-5">
        <IconCard
          className="flex-1"
          icon="templet"
          title="沧州银行大数据工作台+弹性存储最佳实践"
          subtitle="通用云上弹性服务器配合大数据处理的最佳实践"
        />
        <IconCard
          icon="templet"
          className="flex-1"
          title="大数据工作台流批一体最佳实践"
          subtitle="通过流批一体的方式，轻量化解决企业数据处理"
        />
      </CardContent>
    </Card>
    <Card tw="w-4/12 leading-5">
      <CardHeader title="相关产品" />
      <CardContent tw="pb-3 flex justify-center space-x-2 2xl:space-x-5">
        <IconCard icon="laptop" title="QingMr" layout="vertical" />
        <IconCard icon="laptop" title="MySQL" layout="vertical" />
        <IconCard icon="laptop" title="Hbase" layout="vertical" />
      </CardContent>
    </Card>
  </div>
)

export default BestPractice
