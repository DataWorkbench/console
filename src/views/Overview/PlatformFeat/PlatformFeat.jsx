import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Card, { CardHeader, CardContent } from 'components/Card'
import FeatsList from './FeatsList'

const feats = [
  {
    title: '任务监控与运维',
    subtitle:
      '可以按照工作空间、责任人等对节点聚合。支持任务和实例的上下游分析。',
  },
  {
    title: '可视化编排开发流程',
    subtitle:
      '作业开发、版本管理、作业调度等可视化操作，轻松完成整个数据的处理流程。',
  },
  {
    title: '成员角色授权与管理',
    subtitle:
      '资源委托给更专业、高效的其他云帐号或者云服务，可以根据权限进行代运维。',
  },
]

const PlatformFeat = ({ className }) => {
  return (
    <Card className={clsx(className)}>
      <CardHeader
        title="平台特性"
        subtitle="帮助您更加全面了解和使用大数据平台，满足您的业务需求"
      />
      <CardContent>
        <FeatsList feats={feats} />
      </CardContent>
    </Card>
  )
}

PlatformFeat.propTypes = {
  className: PropTypes.string,
}

export default PlatformFeat
