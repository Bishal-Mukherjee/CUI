import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import AdminPanel from './layouts/dashboard';

import Dashboard from './layouts/dashboard/Dashboard';
import Users from './sections/users/Users';
import PreviewLayout from './layouts/preview/PreviewLayout';
import SimpleLayout from './layouts/simple';
import Page404 from './pages/Page404';
import PreviewSection from './sections/preview/Preview';

import { useObjContext } from './context/context';
import AuthWrapper from './sections/auth/AuthWrapper';
import LiveLayout from './layouts/live/LiveTemplateLayout';
import LiveSection from './sections/live/Live';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useObjContext();
  const routes = useRoutes([
    {
      path: '/',
      element: <LiveLayout />,
      children: [{ element: <LiveSection />, index: true }],
    },
    {
      path: '/login',
      element: <AuthWrapper />,
    },
    {
      path: '/index',
      element: <Dashboard />,
      children: user
        ? user.designation === 'Admin'
          ? [
              { element: <Navigate to="/index/users" />, index: true },
              {
                path: 'users',
                element: <Users />,
              },
              { path: 'panel', element: <AdminPanel /> },
            ]
          : [
              { element: <Navigate to="/index/panel" />, index: true },
              { path: 'panel', element: <AdminPanel /> },
            ]
        : [{ element: <Navigate to="/" />, index: true }],
    },
    {
      path: '/preview/:brandname/:version',
      element: <PreviewLayout />,
      children: user
        ? [{ element: <PreviewSection />, index: true }]
        : [{ element: <Navigate to="/login" />, index: true }],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/index" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
  return routes;
}
