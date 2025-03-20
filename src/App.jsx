import { useState } from 'react'
import reactLogo from './assets/react.svg'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import React from 'react';
import { Navbar } from './components/Navbar/Navbar';
import Home from './pages/Home';
import TuyenXePage from './pages/TuyenXePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerifyAccount from './components/VerifyAccount/VerifyAccount';
import Unauthorized from './components/Unauthorized/Unauthorized';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminPage from './pages/AdminPage';
import UserDashboard from './pages/UserDashboard';
import Verify from './components/VerifyAccount/VerifyAccount';

const App = () => {
  return (
    <>
    <Router>
    <main className='w-full flex flex-col bg-neutral-50 min-h-screen'>
      {/* Navbar */}
        {/* <Navbar></Navbar> */}

      {/* Routing */}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/lich-trinh" element={<TuyenXePage/>} />
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>

        <Route path="/verify" element={<Verify />} /> {/* Thêm route xác nhận */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user/dashboard" 
          element={
            <PrivateRoute requiredRole="CUSTOMER">
              <UserDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>

      </main>
    </Router>
      
    </>
  )
}

export default App