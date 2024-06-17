import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import DefaultLayout from "./components/Layout/DefaultLayout";
import LogIn from "./components/authentication/Login";
import ForgetPassword from "./components/authentication/ForgetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Permissions from "./components/pages/Permissions";
import Users from "./components/pages/Users";
import CreateRole from "./components/pages/CreateRole";
import CreatePermission from "./components/pages/CreatePermission";
import EditRole from "./components/pages/EditRole";
import EditPermission from "./components/pages/EditPermission";
import CreateUser from "./components/pages/CreateUser";
import EditUser from "./components/pages/EditUser";
import { useEffect } from "react";
import ResetPassword from "./components/authentication/ResetPassword";
import Roles from "./components/pages/Roles";
import Profile from "./components/pages/Profile";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import Configs from "./components/pages/Configs";
import Menus from "./components/pages/Menus";
import { getRoutePath } from "./global";
import Error from "./components/common/Error";

// console.log = console.warn = console.error = () => {};

const routes = [
  {
    path: getRoutePath("role"),
    component: Roles,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("role/create"),
    component: CreateRole,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("role/edit/:id"),
    component: EditRole,
    layout: DefaultLayout,
    protected: true,
  },

  {
    path: getRoutePath("user"),
    component: Users,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("user/create"),
    component: CreateUser,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("user/edit/:id"),
    component: EditUser,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("Permission"),
    component: Permissions,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("permission/create"),
    component: CreatePermission,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("permission/edit/:id"),
    component: EditPermission,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("config"),
    component: Configs,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("menu"),
    component: Menus,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("profile"),
    component: Profile,
    layout: DefaultLayout,
    protected: true,
  },
  {
    path: getRoutePath("login"),
    component: LogIn,
    layout: null,
  },
  {
    path: getRoutePath("forget-password"),
    component: ForgetPassword,
    layout: null,
  },
  {
    path: getRoutePath("reset-password"),
    component: ResetPassword,
    layout: null,
  },
  {
    path: getRoutePath("404"),
    component: Error,
    layout: null,
  },
  {
    path: getRoutePath("dashboard"),
    exact: true,
    component: DefaultLayout,
    layout: null,
    protected: true,
  },
  {
    path: "/*",
    exact: true,
    component: DefaultLayout,
    layout: null,
    protected: true,
  },
];

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = "/dashboard";
    if (window.location.pathname.split("/").length <= 1) {
      navigate(redirectPath);
    }
  }, [navigate]);
  return (
    <>
      <ToastContainer />
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.protected ? (
                route.layout ? (
                  <route.layout>
                    <ProtectedRoute>
                      <route.component />
                    </ProtectedRoute>
                  </route.layout>
                ) : (
                  <ProtectedRoute>
                    <route.component />
                  </ProtectedRoute>
                )
              ) : route.layout ? (
                <route.layout>
                  <route.component />
                </route.layout>
              ) : (
                <route.component />
              )
            }
            {...(route.exact && { exact: true })}
          />
        ))}
      </Routes>
    </>
  );
}

export default App;
