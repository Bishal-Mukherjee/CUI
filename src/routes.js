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
import SignIn from './sections/auth/SignIn/SignIn';
import SignUp from './sections/auth/SignUp/SignUp';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useObjContext();
  const routes = useRoutes([
    {
      path: '/',
      element: <AuthWrapper />,
      children: [
        { element: <Navigate to="/signin" />, index: true },
        { path: 'signin', element: <SignIn /> },
        { path: 'signup', element: <SignUp /> },
      ],
    },
    {
      path: 'index',
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
      path: 'preview',
      element: <PreviewLayout />,
      children: [
        { element: <Navigate to="/preview/:brandname/:version" />, index: true },
        { path: ':brandname/:version', element: <PreviewSection /> },
      ],
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
