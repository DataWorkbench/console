import { lazy, useEffect } from 'react'
import { Redirect, Switch, Route, useRouteMatch } from 'react-router-dom'
import { useStore } from 'stores'
// home
const Layout = lazy(() => import(/* webpackChunkName: "home" */ 'views/Layout'))
const Create = lazy(() => import(/* webpackChunkName: "home" */ 'views/Create'))
const Overview = lazy(
  () => import(/* webpackChunkName: "home" */ 'views/Overview')
)
const WorkSpace = lazy(
  () => import(/* webpackChunkName: "home" */ 'views/WorkSpace')
)

// space
const SpaceLayout = lazy(
  () => import(/* webpackChunkName: "space" */ 'views/Layout/SpaceLayout')
)
const Dm = lazy(() => import(/* webpackChunkName: "space" */ 'views/Space/Dm'))
const Manage = lazy(
  () => import(/* webpackChunkName: "space" */ 'views/Space/Manage')
)
const Ops = lazy(
  () => import(/* webpackChunkName: "space" */ 'views/Space/Ops')
)
const Upcloud = lazy(
  () => import(/* webpackChunkName: "space" */ 'views/Space/Upcloud')
)

const Routes = () => {
  const { globalStore } = useStore()
  const darkMode = !!useRouteMatch([
    '/:zone/workspace/:space/dm',
    '/:zone/workspace/:space/ops',
  ])

  useEffect(() => {
    const htm = document.documentElement
    if (darkMode) {
      htm.classList.add('dark')
    } else {
      htm.classList.remove('dark')
    }
    globalStore.set({ darkMode })
  }, [darkMode, globalStore])

  return (
    <Switch>
      <Route path="/:regionId/workspace/:spaceId">
        <SpaceLayout>
          <Switch>
            <Route
              path="/:regionId/workspace/:spaceId/upcloud/:mod?"
              component={Upcloud}
            />
            <Route
              path="/:regionId/workspace/:spaceId/dm/:mod?"
              component={Dm}
            />
            <Route
              path="/:regionId/workspace/:spaceId/ops/:mod?"
              component={Ops}
            />
            <Route
              path="/:regionId/workspace/:spaceId/manage/:mod?"
              component={Manage}
            />
          </Switch>
        </SpaceLayout>
      </Route>
      <Route>
        <Layout>
          <Switch>
            <Route path="/create/:step?" component={Create} />
            <Route path="/overview" component={Overview} />
            <Route path="/workspace" component={WorkSpace} />
            <Route
              path="/"
              exact
              component={() => <Redirect to="/overview" />}
            />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  )
}

export default Routes
