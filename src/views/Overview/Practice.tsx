import React from 'react'
import { Card, CardHeader, CardContent, IconCard } from 'components'

interface Props {
  className?: string
}

const Practice: React.FC<Props> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader title="最佳实践" />
      <CardContent>
        <div tw="flex justify-center space-x-2 2xl:space-x-5">
          <IconCard
            tw="flex-1"
            icon="templet"
            title="沧州银行大数据工作台+弹性存储最佳实践"
            subtitle="通用云上弹性服务器配合大数据处理的最佳实践"
          />
          <IconCard
            icon="templet"
            tw="flex-1"
            title="大数据工作台流批一体最佳实践"
            subtitle="通过流批一体的方式，轻量化解决企业数据处理"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default Practice
