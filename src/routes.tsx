import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import App from "./App";

const Events = lazy(() => import("./pages/Events"));
const Login = lazy(() => import("./pages/Login"));
const Registration = lazy(() => import("./pages/RegistrationQR"));
const AttendanceList = lazy(() => import("./pages/AttendanceList"));
const AttendanceListClasses = lazy(() => import("./pages/AttendanceListClasses"));
const Settings = lazy(() => import("./pages/Settings"));

const routes = [
  { path: "", element: Events },
  { path: "/", element: Events },
  { path: "/events", element: Events },
  { path: "/registration", element: Registration },
  { path: "/attendanceList", element: AttendanceList },
  { path: "/attendanceList/classes-view", element: AttendanceListClasses },
  { path: "/settings", element: Settings },
];

const RoutesContainer = () => {
  return (
    <Router>
        <App>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            <Routes>
              {routes.map((route, key) => {
                const RouteComponent = route.element;
                return <Route key={key} path={route.path} element={<RequireAuth fallbackPath={'/login'}><RouteComponent /></RequireAuth>} />;
              })}
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
        </Suspense>
        </App>
    </Router>
  )
};

export default RoutesContainer;
