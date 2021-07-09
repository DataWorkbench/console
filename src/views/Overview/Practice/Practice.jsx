import React from 'react'
import Card, { CardHeader, CardContent } from 'components/Card'
import PropTypes from 'prop-types'
import IconCard from '../IconCard'

const Practice = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader title="最佳实践" />
      <CardContent>
        <div className="tw-flex tw-justify-center">
          <IconCard
            className="tw-mr-5 tw-flex-1 tw-max-w-sm"
            icon="templet"
            title="沧州银行大数据工作台+弹性存储最佳实践"
            subtitle="通用云上弹性服务器配合大数据处理的最佳实践"
          />
          <IconCard
            icon="templet"
            className="tw-flex-1 tw-max-w-sm"
            title="大数据工作台流批一体最佳实践"
            subtitle="通过流批一体的方式，轻量化解决企业数据处理"
          />
        </div>
      </CardContent>
    </Card>
  )
}

Practice.propTypes = {
  className: PropTypes.string,
}

export default Practice
