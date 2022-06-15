import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCookie } from 'react-use'
import { observer } from 'mobx-react-lite'
import { FlexBox } from 'components'
import { set as lodashSet } from 'lodash-es'
import { clearStorage } from 'utils/storage'
import { useQueryDescribePlatformConfig } from '../../hooks'

const Header = React.lazy(
  () => import(/* webpackChunkName: "space" */ 'views/Space/Header')
)

export const SpaceLayout = observer(({ children }) => {
  const { regionId } = useParams<{ regionId: string }>()
  const [zone, updateZone] = useCookie('zone')
  const { data: platform } = useQueryDescribePlatformConfig(
    {
      regionId,
    },
    {},
    1000 * 60 * 60 * 24 * 30
  )

  useEffect(() => {
    let url = platform?.documents_address ?? ''
    if (!url.includes('//')) {
      url = `//${url}`
    }
    lodashSet(window, 'GLOBAL_CONFIG.new_docs_url', url)
    lodashSet(window, 'GLOBAL_CONFIG.docs_center_url', url)
  }, [platform])

  useEffect(() => {
    clearStorage()
  }, [])

  useEffect(() => {
    if (regionId && zone !== regionId) {
      updateZone(regionId, { expires: 365 })
    }
  }, [regionId, zone, updateZone])

  return (
    <FlexBox
      orient="column"
      tw="h-screen bg-neut-2 dark:bg-neut-17 transition-colors duration-500"
    >
      <Header />
      <FlexBox flex="1" tw="overflow-y-auto pb-5">
        {children}
      </FlexBox>
    </FlexBox>
  )
})

export default SpaceLayout
