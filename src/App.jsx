import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastConfig } from "./utils/toastConfig";

// Layouts
import Layout from "./Layout/Layout";
import AdminLayout from "./Layout/AdminLayout";

// Pages - User
import Home from "./pages/HomePage";
import Register from "./components/Auth/Register";

import TuyenXe from "./components/comon/TuyenDuong";
import VerifyAccount from "./components/Auth/VerifyAccount";
import Login from "./components/Auth/Login";

import Unauthorized from "./components/comon/Unauthorized";

// Pages - Admin
import Dashboard from "./components/Admin/Dashboard";
import RoutesManagement from "./components/Admin/RoutesManagement";
import UsersManagement from "./components/Admin/UsersManagement";
import ProvinceManagement from "./components/Admin/ProvinceManagement";
import VehiclesManagement from "./components/Admin/VehiclesManagement";
import RouteSchedule from "./components/Admin/RouteSchedule";
import OrderManagement from "./components/Admin/OrderManagement";
import RouteScheduleEdit from "./components/Admin/RouteScheduleEdit";
import TripDetails from "./components/Admin/TripDetails";

// Route guard
import PrivateRoute from "./components/Auth/PrivateRoute";
import UserAccount from "./pages/UserAccount";
import TripManagement from "./components/Admin/TripManagement";
import SearchBar from "./components/comon/BusSearch";
import BookingPage from "./pages/BookingPage";
import BookingDetail from "./components/Booking/BookingDetail";
import PaySuccess from "./components/Booking/PaySuccess";
import RatingManagement from "./components/Admin/RatingManagement";
import PayFail from "./components/Booking/PayFail";
import AboutUsPage from "./pages/AboutUsPage";
import FindMyBooking from "./components/comon/FindMyBooking";
import Discount from "./components/Admin/DiscountManagement";
import ForgotPassword from "./components/Auth/ForgotPassword";
import DriverManagement from "./components/Admin/DriverManagement";
import DriverSchedule from "./components/Admin/DriverSchedule";

const App = () => {
  return (
    <Router>
      <main className="w-full flex flex-col bg-neutral-50 min-h-screen">
        <Routes>
          {/* USER LAYOUT ROUTES */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dat-ve" element={<BookingPage />}></Route>
            <Route path="/tuyen-duong" element={<TuyenXe />} />
            <Route path="/BookingDetail" element={<BookingDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyAccount />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/user/profile" element={<UserAccount />} />
            <Route path="/user/bookings" element={<UserAccount />} />
            <Route path="/payment-success" element={<PaySuccess />} />
            <Route path="/payment-failed" element={<PayFail />} />
            <Route path="/tra-cuu-ve" element={<FindMyBooking />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/route-schedule/:routeId"
              element={<RouteSchedule />}
            />
            <Route path="/about-us" element={<AboutUsPage />}></Route>
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
            <Route path="dashboard" element={<UsersManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="rating" element={<RatingManagement />} />
            <Route path="/admin/trip-details" element={<TripDetails />} />
            <Route path="routes" element={<RoutesManagement />} />
            <Route path="manage-trips" element={<TripManagement />} />
            <Route path="manage-orders" element={<OrderManagement />} />
            <Route path="discount" element={<Discount />} />
            <Route
              path="/admin/route-schedule/:routeId/edit"
              element={<RouteScheduleEdit />}
            />
            <Route
              path="routes/:routeId/schedule"
              element={<RouteSchedule />}
            />
            <Route path="province" element={<ProvinceManagement />} />
            <Route path="vehicles" element={<VehiclesManagement />} />
            <Route path="manage-drivers" element={<DriverManagement />} />
            <Route path="driver-schedule" element={<DriverSchedule />} />
          </Route>
        </Routes>
      </main>
      <ToastContainer limit={1} {...toastConfig} />
    </Router>
  );
};

export default App;
