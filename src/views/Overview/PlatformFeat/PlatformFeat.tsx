import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent } from 'components'
// import { useStore } from 'stores'
import FeatsList from './FeatsList'

const PlatformFeat = ({ className }) => {
  // const {
  //   overViewStore: { platFeats },
  // } = useStore()
  const platFeats = useMemo(
    () => [
      {
        title: '提供全托管式 Flink 集群',
        subtitle:
          '仅提供 SQL语句即可提交Flink任务运行，并支持按照任务进行监控。',
      },
      {
        title: '工作空间隔离',
        subtitle:
          '对于不同维度业务作业，提供多个工作空间进行操作，空间资源互相隔离、数据互相独立。',
      },
      {
        title: '多种数据源支持',
        subtitle:
          '支持：“MySQL”、“PostgreSQL”、“Kafka ” 、“ClickHouse”、“HBase”、“HDFS”、“FTP”等多种数据源。',
      },
    ],
    []
  )

  return (
    <Card className={className}>
      <CardHeader
        title="平台特性"
        subtitle="帮助您更加全面了解和使用大数据平台，满足您的业务需求"
      />
      <CardContent>
        <FeatsList feats={platFeats} />
      </CardContent>
    </Card>
  )
}

PlatformFeat.propTypes = {
  className: PropTypes.string,
}

export default PlatformFeat
