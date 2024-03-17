import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import PrivateRoute from './private-router'

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ForgotPwdPage = lazy(() => import('src/pages/forgot-pwd'));
export const ResetPwdPage = lazy(() => import('src/pages/reset-pwd'));
export const ActivationPage = lazy(() => import('src/pages/activate'));
export const EmotionPage = lazy(() => import('src/pages/emotion'));
export const SpotifyCallback = lazy(() =>import('src/components/spotify/spotify-callback'))
export const SettingsPage = lazy(() => import('src/pages/settings'));

// ----------------------------------------------------------------------

export default function Router() {

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <PrivateRoute component={IndexPage} />},
        { path: 'user', element: <PrivateRoute component={UserPage} />},
        { path: 'products', element: <PrivateRoute component={ProductsPage} />},
        { path: 'blog', element: <PrivateRoute component={BlogPage} />},
        { path: 'emotion', element: <PrivateRoute component={EmotionPage} />},
        { path: 'spotify-callback', element: <PrivateRoute component={SpotifyCallback} />},
        { path: 'profile-settings', element: <PrivateRoute component={SettingsPage} />},
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'forgot-pwd',
      element: <ForgotPwdPage />,
    },
    {
      path: 'reset-password',
      element: <ResetPwdPage />,
    },
    {
      path: 'activate',
      element: <ActivationPage />,
    }
  ]);

  return routes;
}
