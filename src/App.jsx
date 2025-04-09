import { useState } from "react";
import reactLogo from "./assets/react.svg";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React from "react";
import { Navbar } from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import TuyenXePage from "./pages/TuyenXePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyAccount from "./components/feature/Auth/VerifyAccount";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import RoutesManagement from "./pages/Admin/RoutesManagement";
import UsersManagement from "./pages/Admin/UsersManagement";
import AdminLayout from "./Layout/AdminLayout";
import ProvinceManagement from "./pages/Admin/ProvinceManagement";

const App = () => {
  return (
    <>
      <Router>
        <main className="w-full flex flex-col bg-neutral-50 min-h-screen">
          {/* Navbar */}
          {/* <Navbar></Navbar> */}

          {/* Routing */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/lich-trinh" element={<TuyenXePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage></LoginPage>}></Route>
            <Route path="/verify" element={<VerifyAccount />} />{" "}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute requiredRole="CUSTOMER">
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              {/* Các route con của admin */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="routes" element={<RoutesManagement />} />
              <Route path="province" element={<ProvinceManagement />} />
            </Route>
          </Routes>
        </main>
      </Router>
    </>
  );
};

export default App;
