import Home from 'components/Home'
import Create from 'views/Create'
import Overview from 'views/Overview'
import Layout, { SpaceLayout } from 'views/Layout'
import Workspace from 'views/Workspace'
import Dm from 'views/Space/Dm'
import Manage from 'views/Space/Manage'
import Ops from 'views/Space/Ops'
import Upcloud from 'views/Space/Upcloud'
import RealTimeComputing from 'views/Space/Dm/RealTimeComuting'

const routes = [
  {
    path: '/workspace/:space',
    component: SpaceLayout,
    routes: [
      {
        path: '/workspace/:space/upcloud/:mod?',
        component: Upcloud,
      },
      {
        path: '/workspace/:space/dm/:submod?',
        component: Dm,
        routes: [
          {
            path: '/workspace/:space/dm/realtime_computing',
            component: RealTimeComputing,
          },
        ],
      },
      {
        path: '/workspace/:space/ops',
        component: Ops,
      },
      {
        path: '/workspace/:space/manage',
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
        component: Workspace,
      },
      {
        path: '/',
        component: Home,
      },
      {
        path: '/home',
        component: Home,
      },
    ],
  },
]

export default routes
