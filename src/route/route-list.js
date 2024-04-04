import { lazy } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { PRIVILEGE_ADMIN, PRIVILEGE_USER } from '../app/privileges';
// import HomePage from '../page/HomePage';
// import LoginPage from '../page/LoginPage';
// import AdminUserPage from '../page/admin/AdminUserPage';
// import HomeAdminPage from '../page/admin/HomeAdminPage';
// import SystemSettingPage from '../page/admin/SystemSettingPage';
// import HomeUserPage from '../page/user/HomeUserPage';
// import UserFilePage from '../page/user/UserFilePage';
// import UserMessagePage from '../page/user/UserMessagePage';
import { ProtectedLayout } from './ProtectedLayout';
//import ErrorPage from "./error-page";
const ErrorPage = lazy(() => import('./error-page'));
const HomePage = lazy(() => import('../page/HomePage'));
const LoginPage = lazy(() => import('../page/LoginPage'));
const HomeUserPage = lazy(() => import('../page/user/HomeUserPage'));
const UserMessagePage = lazy(() => import('../page/user/UserMessagePage'));
const UserFilePage = lazy(() => import('../page/user/UserFilePage'));
const AdminUserPage = lazy(() => import('../page/admin/AdminUserPage'));
const HomeAdminPage = lazy(() => import('../page/admin/HomeAdminPage'));
const SystemSettingPage = lazy(() => import('../page/admin/SystemSettingPage'));
const ShareLoginPage = lazy(() => import('../page/public/ShareLoginPage'));
const ShareMessagePage = lazy(() => import('../page/public/ShareMessagePage'));
const ShareFilePage = lazy(() => import('../page/public/ShareFilePage'));

function renderRoutes(routes) {
    return routes.map((route) => (
        <Route key={route.path} path={route.path} element={renderRouteElement(route)} errorElement={route?.errorElement}>
            {route.child && renderRoutes(route.child)}
        </Route>
    ));
}
function renderRouteElement(route) {
    if (route.element === 'ProtectedLayout') {
        return <ProtectedLayout privilege={route.privilege} component={route.component} />
    } else {
        return route.element
    }
}

export const routerList = [
    {
        path: '/',
        errorElement: <ErrorPage />,
        child: [
            {
                path: '',
                element: <HomePage />
            },
            {
                path: 'login',
                element: <LoginPage />
            }
        ]
    },
    {
        path: '/ls',
        errorElement: <ErrorPage />,
        child: [
            {
                path: ':linkKey',
                name: 'check login link',
                element: <ShareLoginPage/>
            }
        ]
    },
    {
        path: '/ms',
        errorElement: <ErrorPage />,
        child: [
            {
                path: ':linkKey',
                name: 'share message link',
                element: <ShareMessagePage/>
            }
        ]
    },
    {
        path: '/fs',
        errorElement: <ErrorPage />,
        child: [
            {
                path: ':linkKey',
                name: 'share message link',
                element: <ShareFilePage/>
            }
        ]
    },
    {
        path: '/user',
        name: 'user menu',
        element: 'ProtectedLayout',
        privilege: [PRIVILEGE_USER],
        child: [
            {
                path: '',
                name: 'user home',
                element: <HomeUserPage />
            },
            {
                path: 'message',
                name: 'user messages',
                element: <UserMessagePage/>
            },
            {
                path: 'file',
                name: 'user files',
                element: <UserFilePage/>
            },
        ]
    },
    {
        path: '/admin',
        name: 'admin menu',
        element: 'ProtectedLayout',
        privilege: [PRIVILEGE_ADMIN],
        child: [
            {
                path: '',
                name: 'admin home',
                element: <HomeAdminPage />
            },
            {
                path: 'user',
                name: 'user manage',
                element: <AdminUserPage />
            },
            {
                path: 'setting',
                name: 'settings',
                element: <SystemSettingPage />
            }
        ]
    },
]

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {renderRoutes(routerList)}
        </>
    )
);

export default router;