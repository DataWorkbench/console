import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent } from 'components'
import { css } from 'twin.macro'
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
          '云端全托管 Flink 集群，对您的海量数据进行亚秒级处理，支持流批一体的作业处理方式，覆盖多种业务场景。'
      },
      {
        title: '工作空间隔离',
        subtitle: '对于不同维度业务作业，提供多个工作空间进行操作，空间资源互相隔离、数据互相独立。'
      },
      {
        title: '多种数据源支持',
        subtitle:
          '支持：“MySQL”、“PostgreSQL”、“Kafka ” 、“ClickHouse”、“HBase”、“HDFS”、“FTP”等多种数据源。'
      }
    ],
    []
  )

  return (
    <Card className={className} hasBoxShadow tw="w-full">
      <CardHeader
        hasPrex={false}
        title={
          <span
            css={css`
              font-weight: 700;
              font-size: 20px;
              line-height: 27px;
              letter-spacing: -0.03em;
              color: #333333;
            `}
          >
            平台特性
          </span>
        }
        subtitle="帮助您更加全面了解和使用大数据工作台，满足您的业务需求"
      />
      <CardContent>
        <FeatsList feats={platFeats} />
      </CardContent>
    </Card>
  )
}

PlatformFeat.propTypes = {
  className: PropTypes.string
}

export default PlatformFeat
