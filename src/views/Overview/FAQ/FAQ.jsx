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
    <Card className={clsx(className, 'tw-leading-5')}>
      <CardHeader title="常见问题" />
      <CardContent>
        <div className="tw-rounded-sm tw-border tw-border-neut-2">
          <ul className="tw-text-neut-15 tw-px-5 tw-py-4">
            {questions.map((quest) => (
              <li
                key={quest.title}
                className="tw-flex tw-align-middle tw-mt-2 tw-cursor-pointer hover:tw-text-green-11 hover:tw-font-medium"
              >
                <Icon name="file" />
                <div className="tw-pl-3">{quest.title}</div>
              </li>
            ))}
          </ul>
          <div className="tw-text-center tw-bg-neut-1 tw-py-2 tw-font-medium tw-flex tw-align-middle tw-justify-center">
            <span className="tw-mr-2">更多帮助指引</span>
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
