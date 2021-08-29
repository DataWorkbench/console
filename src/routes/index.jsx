import React, { lazy } from 'react'
import { Redirect } from 'react-router-dom'
import Home from 'components/Home'
import Create from 'views/Create'
import Overview from 'views/Overview'
import Layout, { SpaceLayout } from 'views/Layout'
// import WorkSpace from 'views/WorkSpace'
// import Dm from 'views/Space/Dm'
// import Manage from 'views/Space/Manage'
// import Ops from 'views/Space/Ops'
// import Upcloud from 'views/Space/Upcloud'

const WorkSpace = lazy(() => import('views/WorkSpace'))
const Dm = lazy(() => import('views/Space/Dm'))
const Manage = lazy(() => import('views/Space/Manage'))
const Ops = lazy(() => import('views/Space/Ops'))
const Upcloud = lazy(() => import('views/Space/Upcloud'))

const routes = [
  {
    path: '/:regionId/workspace/:spaceId',
    component: SpaceLayout,
    routes: [
      {
        path: '/:regionId/workspace/:spaceId/upcloud/:mod?',
        component: Upcloud,
      },
      {
        path: '/:regionId/workspace/:spaceId/dm/:mod?',
        component: Dm,
      },
      {
        path: '/:regionId/workspace/:spaceId/ops/:mod?',
        component: Ops,
      },
      {
        path: '/:regionId/workspace/:spaceId/manage/:mod?',
        component: Manage,
      },
    ],
  },
  {
    component: Layout,
    routes: [
      {
        path: '/create/:step?',
        component: Create,
      },
      {
        path: '/overview',
        component: Overview,
      },
      {
        path: '/workspace',
        component: WorkSpace,
      },
      {
        path: '/',
        exact: true,
        component: () => <Redirect to="/overview" />,
      },
      {
        path: '/home',
        component: Home,
      },
    ],
  },
]

export default routes
