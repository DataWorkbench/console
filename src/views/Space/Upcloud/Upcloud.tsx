import { useParams } from 'react-router-dom'
import { ContentBox } from 'components'
import DataSourceList from './DataSourceList'
import { Sider } from '../Sider'

const Upcloud = () => {
  const { mod } = useParams<{ mod: string }>()
  return (
    <>
      <Sider funcMod="upcloud" />
      <ContentBox tw="flex-1 overflow-y-auto ">
        <div tw="p-5">{(mod === 'dsl' || !mod) && <DataSourceList />}</div>
      </ContentBox>
    </>
  )
}

export default Upcloud
