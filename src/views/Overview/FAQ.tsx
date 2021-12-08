import { FC } from 'react'
import { Card, CardHeader, CardContent } from 'components'
import { Icon, Modal, HelpCenterModal } from '@QCFE/qingcloud-portal-ui'

const questions = [
  {
    title: '大数据工作台的基本概念',
    link: '/bigdata/dataplat/intro/concept/',
  },
  {
    title: '使用大数据工作台的准备工作',
    link: '/bigdata/dataplat/prepare/create_workspace/',
  },
  {
    title: '数据开发的基本流程',
    link: '/bigdata/dataplat/intro/development_process/',
  },
  { title: '大数据工作台的计费概述', link: '/bigdata/dataplat/billing/price/' },
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
                <div
                  tw="pl-3 cursor-pointer"
                  onClick={() => {
                    const openModal = Modal.open(HelpCenterModal, {
                      link: quest.link,
                      onCancel: () => Modal.close(openModal),
                    })
                  }}
                >
                  {quest.title}
                </div>
              </li>
            ))}
          </ul>
          <div tw="text-center bg-neut-1 py-2 font-medium flex align-middle justify-center">
            <span tw="mr-2">更多帮助指引</span>
            <Icon name="next" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FAQ
