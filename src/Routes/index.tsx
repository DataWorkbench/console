/* eslint-disable import/no-named-as-default */
import { lazy, useEffect } from 'react'
import { Redirect, Switch, Route, useRouteMatch } from 'react-router-dom'
import { useStore } from 'stores'
import { useDarkMode } from 'hooks'

// import DescribeDataOmnis from 'views/DataOmnis/DescribeDataOmnis'
// import ActivateDataOmnis from 'views/DataOmnis/ActivateDataOmnis'
// import Layout from 'views/Layout'
// import Overview from 'views/Overview'
// import WorkSpace from 'views/WorkSpace'
// import SpaceLayout from 'views/Layout/SpaceLayout'
// import Dm from 'views/Space/Dm'
// import Ops from 'views/Space/Ops'
// import Upcloud from 'views/Space/Upcloud'
// import Manage from 'views/Space/Manage'
// import DataService from 'views/Space/DataService'

const DescribeDataOmnis = lazy(
  () => import(/* webpackChunkName: "grant" */ 'views/DataOmnis/DescribeDataOmnis')
)

// activateDataOmnis
const ActivateDataOmnis = lazy(
  () => import(/* webpackChunkName: "grant" */ 'views/DataOmnis/ActivateDataOmnis')
)

// home
const Layout = lazy(() => import(/* webpackChunkName: "home" */ 'views/Layout'))

const Overview = lazy(() => import(/* webpackChunkName: "home" */ 'views/Overview'))
const WorkSpace = lazy(() => import(/* webpackChunkName: "home" */ 'views/WorkSpace'))

// space
const SpaceLayout = lazy(() => import(/* webpackChunkName: "space" */ 'views/Layout/SpaceLayout'))
const Dm = lazy(() => import(/* webpackChunkName: "space" */ 'views/Space/Dm'))

const DataService = lazy(() => import(/* webpackChunkName: "space" */ 'views/Space/DataService'))

const Manage = lazy(() => import(/* webpackChunkName: "space" */ 'views/Space/Manage'))
const Ops = lazy(() => import(/* webpackChunkName: "space" */ 'views/Space/Ops'))
const Upcloud = lazy(() => import(/* webpackChunkName: "space" */ 'views/Space/Upcloud'))

const Routes = () => {
  const { globalStore } = useStore()

  const matched = !!useRouteMatch([
    '/:zone/workspace/:space/dm',
    '/:zone/workspace/:space/dts',
    '/:zone/workspace/:space/ops'
  ])
  const setDarkMode = useDarkMode()

  useEffect(() => {
    setDarkMode(matched)
    globalStore.set({ darkMode: matched })
  }, [matched, setDarkMode, globalStore])

  const isActivated = localStorage.getItem('DATA_OMNIS_OPENED')

  if (!isActivated) {
    return (
      <Route>
        <Layout>
          <Switch>
            <Route path="/describe" component={DescribeDataOmnis} />
            <Route path="/activate" component={ActivateDataOmnis} />
            <Route path="/" component={() => <Redirect to="/describe" />} />
          </Switch>
        </Layout>
      </Route>
    )
  }

  return (
    <Switch>
      <Route path="/:regionId/workspace/:spaceId">
        <SpaceLayout>
          <Switch>
            <Route path="/:regionId/workspace/:spaceId/upcloud/:mod?" component={Upcloud} />
            <Route path="/:regionId/workspace/:spaceId/dm/:mod?" component={Dm} />
            <Route
              path="/:regionId/workspace/:spaceId/dts/:mod?/:detail?"
              component={DataService}
            />
            <Route path="/:regionId/workspace/:spaceId/ops/:mod?/:detail?" component={Ops} />

            <Route path="/:regionId/workspace/:spaceId/manage/:mod?" component={Manage} />
            <Route component={Upcloud} />
          </Switch>
        </SpaceLayout>
      </Route>
      <Route>
        <Layout>
          <Switch>
            <Route path="/overview" component={Overview} />
            <Route path="/workspace" component={WorkSpace} />
            <Route path="/" exact component={() => <Redirect to="/overview" />} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  )
}

export default Routes
