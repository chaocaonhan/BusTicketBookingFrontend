import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import Layout from "./Layout/Layout";
import AdminLayout from "./Layout/AdminLayout";

// Pages - User
import Home from "./pages/User/Home";
import Register from "./components/feature/User/Register";

import TuyenXe from "./components/TuyenXe/TuyenXe";
import VerifyAccount from "./components/feature/User/VerifyAccount";
import Login from "./components/feature/User/Login";

import Unauthorized from "./components/Unauthorized/Unauthorized";
import Profile from "./components/feature/User/Profile";

// Pages - Admin
import Dashboard from "./pages/Admin/Dashboard";
import RoutesManagement from "./pages/Admin/RoutesManagement";
import UsersManagement from "./pages/Admin/UsersManagement";
import ProvinceManagement from "./pages/Admin/ProvinceManagement";
import VehiclesManagement from "./pages/Admin/VehiclesManagement";
import RouteSchedule from "./components/Admin/RouteSchedule";

// Route guard
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

// React App
const App = () => {
  return (
    <Router>
      <main className="w-full flex flex-col bg-neutral-50 min-h-screen">
        <Routes>
          {/* USER LAYOUT ROUTES */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lich-trinh" element={<TuyenXe />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyAccount />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/user/profile" element={<Profile />} />
          </Route>

          {/* ADMIN LAYOUT ROUTES */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="routes" element={<RoutesManagement />} />
            <Route
              path="routes/:routeId/schedule"
              element={<RouteSchedule />}
            />
            <Route path="province" element={<ProvinceManagement />} />
            <Route path="vehicles" element={<VehiclesManagement />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
