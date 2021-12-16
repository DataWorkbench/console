import { FC } from 'react'
import { Card, CardHeader, CardContent, HelpCenterLink } from 'components'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const questions = [
  {
    title: '大数据工作台的基本概念',
    link: '/intro/concept/',
  },
  {
    title: '使用大数据工作台的准备工作',
    link: '/prepare/create_workspace/',
  },
  {
    title: '数据开发的基本流程',
    link: '/intro/development_process/',
  },
  { title: '大数据工作台的计费概述', link: '/billing/price/' },
  { title: '大数据平台监控与运维', link: '' },
  { title: '大数据工作台的计费概述11', link: '' },
]

const FAQ: FC = ({ className }) => {
  return (
    <Card className={className} tw="leading-5">
      <CardHeader title="常见问题" />
      <CardContent>
        <div tw="rounded-sm border border-neut-2">
          <ul tw="text-neut-15 px-5 py-4">
            {questions.map((quest) => (
              <li
                key={quest.title}
                tw="flex align-middle mt-2 cursor-pointer hover:text-green-11 hover:font-medium"
              >
                <Icon name="file" />
                <HelpCenterLink href={quest.link}>{quest.title}</HelpCenterLink>
              </li>
            ))}
          </ul>
          <div tw="text-center bg-neut-1 py-2 font-medium flex align-middle justify-center">
            <HelpCenterLink tw="mr-2" href="/intro/introduction/">
              更多帮助指引
            </HelpCenterLink>
            <Icon name="next" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FAQ
