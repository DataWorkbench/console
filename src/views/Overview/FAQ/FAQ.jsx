import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Card, { CardHeader, CardContent } from 'components/Card'
import { Icon } from '@QCFE/qingcloud-portal-ui'

const questions = [
  { title: '大数据工作台的基本概念', link: '' },
  { title: '使用大数据工作台的准备工作', link: '' },
  { title: '数据开发的基本流程', link: '' },
  { title: '大数据平台监控与运维', link: '' },
  { title: '大数据工作台的计费概述', link: '' },
  { title: '大数据工作台的计费概述11', link: '' },
]

const FAQ = ({ className }) => {
  return (
    <Card className={clsx(className, 'leading-5')}>
      <CardHeader title="常见问题" />
      <CardContent>
        <div className="rounded-sm border border-neutral-N-2">
          <ul className="text-neutral-N-15 px-5 py-4">
            {questions.map((quest) => (
              <li
                key={quest.title}
                className="flex align-middle mt-2 cursor-pointer hover:text-brand-G11 hover:font-medium"
              >
                <Icon name="file" />
                <div className="pl-3">{quest.title}</div>
              </li>
            ))}
          </ul>
          <div className="text-center bg-neutral-N-1 py-2 font-medium flex align-middle justify-center">
            <span className="mr-2">更多帮助指引</span>
            <Icon name="next" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

FAQ.propTypes = {
  className: PropTypes.string,
}

export default FAQ
