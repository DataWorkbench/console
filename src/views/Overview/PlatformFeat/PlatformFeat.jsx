import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Card, { CardHeader, CardContent } from 'components/Card'
import { useStore } from 'stores'
import FeatsList from './FeatsList'

const PlatformFeat = ({ className }) => {
  const {
    overViewStore: { platFeats },
  } = useStore()
  return (
    <Card className={clsx(className)}>
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
