import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { RequireAuth } from 'react-auth-kit'
import App from "./App";

const Home = lazy(() => import("./pages/AttendanceList"));
const Events = lazy(() => import("./pages/Events"));
const Login = lazy(() => import("./pages/Login"));
const Registration = lazy(() => import("./pages/RegistrationQR"));
const AttendanceList = lazy(() => import("./pages/AttendanceList"));
const Settings = lazy(() => import("./pages/Settings"));

const routes = [
  { path: "", element: Home },
  { path: "/registration", element: Registration },
  { path: "/attendanceList", element: AttendanceList },
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
                return <Route key={key} path={route.path} element={<RequireAuth loginPath={'/login'}><RouteComponent /></RequireAuth>} />;
              })}              
              <Route path="/events" element={<RequireAuth loginPath={'/login'}><Events /></RequireAuth>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
      </Suspense>
        </App>
    </Router>
  )
};

export default RoutesContainer;
